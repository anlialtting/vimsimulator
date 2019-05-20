/*© An-Li Ting (anliting.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/import moduleLoader from 'https://cdn.rawgit.com/anliting/module/533c10b65a8b71c14de16f5ed99e466ddf8a2bae/src/esm/moduleLoader.js';
import { dom, EventEmmiter } from 'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js';

var _welcomeText = `\
                     Web Vim

Thanks Bram Moolenaar et al. for the original Vim!

             type :q<Enter> to exit            
`;

var lc = s=>{
    let
        l=s.split('\n').length-1,
        c=s.length;
    return `${l}L, ${c}C`
};

function _write(){
    let p=this._registers['%'];
    this.write&&this.write(p);
    return `${p?`"${p}"`:'[Event-Only]'} ${lc(this._text)} written`
}

function _edit(p){
    let read=this.read(p);
    this._registers['%']=p;
    if(read==undefined){
        this.text='';
        return `"${p}" [New File]`
    }else{
        this.text=read;
        return `"${p}" ${lc(read)}`
    }
}

function Cursor(set,get){
    this._position=0;
    Object.defineProperty(this,'string',{set,get});
}
Object.defineProperty(Cursor.prototype,'backspace',{get(){
    if(this._position<1)
        return
    this.string=
        this.string.substring(0,this._position-1)+
        this.string.substring(this._position);
    this._position--;
}});
Object.defineProperty(Cursor.prototype,'delete',{get(){
    if(this._position==this.string.length)
        return
    this.string=
        this.string.substring(0,this._position)+
        this.string.substring(this._position+1);
}});
Object.defineProperty(Cursor.prototype,'end',{get(){
    this._position=this.string.length;
}});
Object.defineProperty(Cursor.prototype,'home',{get(){
    this._position=0;
}});
Object.defineProperty(Cursor.prototype,'position',{set(v){
    this._position=Math.min(this.string.length,Math.max(0,v));
},get(){
    return this._position
}});

var _mode = {
    set(val){
        this._viewChanged.mode=true;
        this._modeData={};
        let abs=this._cursor.abs;
        if(val=='insert'){
            this._welcomeText=undefined;
        }
        if(val=='visual'){
            this._modeData.cursor=this._cursor.abs;
            this._welcomeText=undefined;
        }
        if(val=='cmdline'){
            this._modeData.inputBuffer='';
            this._modeData.cursor=new Cursor(v=>
                this._modeData.inputBuffer=v
            ,()=>
                this._modeData.inputBuffer
            );
        }
        this._values.mode=val;
        if(abs)
            this._cursor.moveTo(abs);
    },get(){
        return this._values.mode
    }
};

var _text = {
    set(val){
        let set=val=>{
            if(typeof val=='string'){
                this._values.text=val;
            }else if(typeof val=='object'){
                let txt=this._values.text;
                if(val.function=='insert')
                    this._values.text=
                        txt.substring(0,val.position)+
                        val.string+
                        txt.substring(val.position);
                else if(val.function=='delete')
                    this._values.text=
                        txt.substring(0,val.start)+
                        txt.substring(val.end);
                else if(val.function=='replace'){
                    this._text={
                        function:'delete',
                        start:val.start,
                        end:val.end,
                    };
                    this._text={
                        function:'insert',
                        position:val.start,
                        string:val.string,
                    };
                    return
                }
            }
            this._viewChanged.text=this._viewChanged.text||[];
            this._viewChanged.text.push(val);
        };
        set(val);
        if(/[^\n]$/.test(this._values.text))set({
            function:'insert',
            position:this._values.text.length,
            string:'\n',
        });
    },get(){
        return this._values.text
    }
};

var loadBase = o=>{
    o._quit=function(){
        this.emit('quit');
    };
    Object.defineProperty(o,'_trueText',{set(val){
        if(this._text=='')
            this._text='\n';
        this._text=val;
    },get(){
        return this._values.text||'\n'
    }});
    o._ui=function(){
        this._uis.forEach(ui=>
            ui._updateByVim(this._viewChanged)
        );
        this._viewChanged={};
    };
    o._read=function(path){
        return this.read&&this.read(path)
    };
    Object.defineProperty(o,'_mode',_mode);
    Object.defineProperty(o,'_text',_text);
    o._write=_write;
    o._edit=_edit;
    o._welcomeText=_welcomeText;
    o._setOption=function(key,value){
        this._options[key]=value;
        this._viewChanged.options=this._viewChanged.options||{};
        this._viewChanged.options[key]=null;
    };
    o._setRegister=function(key,value){
        this._registers[key]=value;
        if(key=='+')
            this.copy&&this.copy(value.string);
    };
    Object.defineProperty(o,'_mainUi',{get(){
        if(!this._values._mainUi){
            this._values._mainUi=this.ui;
            this._values._mainUi.width=80;
            this._values._mainUi.height=24;
        }
        return this._values._mainUi
    }});
};

var docs = {
    a:{
        acceptable:true
    },
    ac:{
        acceptable:true,
        complete:true,
    },
    acc:{
        acceptable:true,
        complete:true,
        changed:true,
    }
};

function A(vim){
    vim._mode='insert';
    vim._trueCursor.moveToEOL();
    return docs.ac
}
function D(vim,cmd,arg){
    return {
        function:'D',
        count:arg||1,
        register:'"',
    }
}
function G(vim,cmd,arg){
    return {
        function:'G',
        count:arg,
    }
}
function I(vim,cmd,arg){
    vim._mode='insert';
    vim._trueCursor.moveTo(vim._trueCursor.lineStart);
    return docs.ac
}
function O(vim,cmd,arg){
    return {function:'O'}
}
function P(vim,cmd,arg){
    return {
        function:'P',
        count:arg||1,
        register:'"',
    }
}
function W(vim,cmd,arg){
    return {
        function:'W',
        count:arg,
    }
}
function X(vim,cmd,arg){
    return {
        function:'X',
        count:arg||1,
        register:'"'
    }
}
function a(vim,cmd,arg){
    return {function:'a'}
}
function d(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(cmd=='d')
        return {
            function:'dd',
            count:arg||1,
            register:'"',
        }
}
function g(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(cmd=='g')
        return {
            function:'gg',
            count:arg,
        }
}
function h(vim,cmd,arg){
    return {
        function:'h',
        count:arg,
    }
}
function i(vim,cmd,arg){
    vim._mode='insert';
    return docs.ac
}
function j(vim,cmd,arg){
    return {
        function:'j',
        count:arg,
    }
}
function k(vim,cmd,arg){
    return {
        function:'k',
        count:arg,
    }
}
function l(vim,cmd,arg){
    return {
        function:'l',
        count:arg,
    }
}
function n(vim,cmd,arg){
    //vim.gotoNextMatch()
    return docs.ac
}
function o(vim,cmd,arg){
    return {function:'o'}
}
function p(vim,cmd,arg){
    return {
        function:'p',
        count:arg||1,
        register:'"',
    }
}
function r(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(vim._text){
        let c=vim._trueCursor.abs;
        vim._text=vim._text.substring(0,c)+cmd+vim._text.substring(c+1);
    }
    return docs.acc
}
function u(vim,cmd,arg){
    let s=vim._undoBranchManager.gotoPrevious();
    if(s!=undefined)
        vim._text=s;
    return docs.ac
}
function v(vim,cmd,arg){
    let c=vim._trueCursor.abs;
    vim._mode='visual';
    vim._trueCursor.moveTo(c);
    return docs.ac
}
function w(vim,cmd,arg){
    return {
        function:'w',
        count:arg,
    }
}
function x(vim,cmd,arg){
    return {
        function:'x',
        count:arg||1,
        register:'"'
    }
}
function y(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(cmd=='y')
        return {
            function:'yy',
            count:arg||1,
            register:'"',
        }
}
var letters = {A,D,G,I,O,P,W,X,a,d,g,h,i,j,k,l,n,o,p,r,u,v,w,x,y};

function shift(vim,s,e,count){
    let cursor=Object.create(vim._trueCursor);
    for(;s!=e;s++){
        cursor.r=s;
        let
            a=cursor.lineStart,
            b=cursor.lineEnd,
            m=vim._trueText.substring(a,b).match(/^([\t ]*)([\S\s]*)/);
        vim._text={
            function:'replace',
            start:a,
            end:b,
            string:padding(vim._options,count(m[1]))+m[2],
        };
    }
}
function padding(o,n){
    let
        a=Math.floor(n/o.tabstop),
        b=n-a*o.tabstop;
    return (
        o.expandtab?' '.repeat(o.tabstop):'\t'
    ).repeat(a)+' '.repeat(b)
}
function countPadding(vim,s){
    return count(s,'\t')*vim._options.tabstop+count(s,' ')
    function count(s,c){
        return s.split(c).length-1
    }
}
function left(vim,s,e){
    shift(vim,s,e,m=>Math.max(0,countPadding(vim,m)-vim._options.shiftwidth));
}
function right(vim,s,e){
    shift(vim,s,e,m=>countPadding(vim,m)+vim._options.shiftwidth);
}
var shift$1 = {
    left,
    right
};

function lt(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(cmd=='<'){
        arg||(arg=1);
        shift$1.left(vim,vim._trueCursor.r,vim._trueCursor.r+arg);
        return docs.acc
    }
}
function gt(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    if(cmd=='>'){
        arg||(arg=1);
        shift$1.right(vim,vim._trueCursor.r,vim._trueCursor.r+arg);
        return docs.acc
    }
}
function dot(vim,cmd,arg){
    return docs.ac
}
function colon(vim){
    vim._mode='cmdline';
    vim._modeData.inputBuffer=':';
    vim._modeData.cursor.position=1;
    return docs.a
}
function slash(vim){
    vim._mode='cmdline';
    vim._modeData.inputBuffer='/';
    vim._modeData.cursor.position=1;
    return docs.a
}
function caret(vim){
    vim._trueCursor.moveTo(vim._trueCursor.lineStart);
    return docs.ac
}
function dollarSign(vim){
    vim._trueCursor.moveTo(Math.max(
        vim._trueCursor.lineStart,
        vim._trueCursor.lineEnd-2
    ));
    return docs.ac
}
function ctrl(vim,cmd){
    if(cmd=='')
        return docs.a
    if(cmd=='r'){
        if(vim._undoBranchManager.current.next!=undefined){
            vim._undoBranchManager.current=
                vim._undoBranchManager.current.next;
            vim._text=vim._undoBranchManager.current.text;
        }
        return docs.ac
    }
}
function quotationMark(vim,cmd,arg){
    if(cmd=='')
        return docs.a
    let register=cmd[0];
    cmd=cmd.substring(1);
    if(cmd=='')
        return docs.a
    let count=arg||1;
    if(cmd=='P')
        return {function:'P',register,count}
    if(cmd=='p')
        return {function:'p',register,count}
    if(cmd=='d'||cmd=='y')
        return docs.a
    if(cmd=='dd')
        return {function:'dd',register,count}
    if(cmd=='yy')
        return {function:'yy',register,count}
}
let commands=Object.assign({
    '<':lt,
    '>':gt,
    '.':dot,
    ':':colon,
    '/':slash,
    '^':caret,
    '$':dollarSign,
    '"':quotationMark,
},letters);
commands[String.fromCharCode(17)]=ctrl;

var ascii = {
    bs:     String.fromCharCode(0x08),
    cr:     String.fromCharCode(0x0d),
    esc:    String.fromCharCode(0x1b),
    del:    String.fromCharCode(0x7f),
};

function yank(vim,r,m,s){
    vim._setRegister(r,{mode:m,string:s});
}
function put(vim,c,s){
    vim._trueText={
        function:'insert',
        position:c,
        string:s,
    };
}
function putCharacterwise(vim,c,s){
    put(vim,c,s);
    vim._trueCursor.moveTo(c+s.length-1);
}
function putLinewise(vim,c,s){
    put(vim,c,s);
    vim._trueCursor.moveTo(c);
}
function delete_(vim,a,b){
    vim._trueText={
        function:'delete',
        start:a,
        end:b,
    };
}
function deleteCharacterwise(vim,r,a,b){
    yank(vim,r,'string',vim._trueText.substring(a,b));
    delete_(vim,a,b);
    vim._trueCursor.moveTo(a);
}
function deleteLinewise(vim,r,a,b){
    yank(vim,r,'line',vim._trueText.substring(a,b));
    delete_(vim,a,b);
}
var functions = {
    yank,
    putCharacterwise,
    putLinewise,
    deleteCharacterwise,
    deleteLinewise,
};

function W$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveGeneralWordRight();
    return docs.ac
}
function h$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveLeft();
    return docs.ac
}
function j$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveDown();
    return docs.ac
}
function k$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveUp();
    return docs.ac
}
function l$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveRight();
    return docs.ac
}
function w$1(vim,doc){
    let count=doc.count||1;
    while(count--)
        vim._trueCursor.moveWordRight();
    return docs.ac
}
var motions = {W: W$1,h: h$1,j: j$1,k: k$1,l: l$1,w: w$1,};

function gotoLine(vim,n){
    vim._trueCursor.moveTo(vim._trueCursor.line(n));
}
function D$1(vim,doc){
    functions.deleteCharacterwise(
        vim,
        doc.register,
        vim._trueCursor.abs,
        vim._trueCursor.lineEnd-1
    );
    if(vim._trueCursor.abs)
        vim._trueCursor.moveTo(vim._trueCursor.abs);
    return docs.acc
}
function G$1(vim,doc){
    gotoLine(vim,Math.min(
        vim._trueCursor._countOfRows,
        doc.count||vim._trueCursor._countOfRows
    )-1);
    return docs.ac
}
function O$1(vim,doc){
    functions.putLinewise(vim,vim._trueCursor.lineStart,'\n');
    vim._mode='insert';
    return docs.acc
}
function P$1(vim,doc){
    let reg=vim._registers[doc.register];
    if(!reg)
        return docs.ac
    let s=reg.string.repeat(doc.count);
    if(reg.mode=='string')
        functions.putCharacterwise(vim,vim._trueCursor.abs,s);
    else if(reg.mode=='line')
        functions.putLinewise(vim,vim._trueCursor.lineStart,s);
    return docs.acc
}
function X$1(vim,doc){
    let
        abs=vim._trueCursor.abs,
        ls=vim._trueCursor.lineStart,
        count=Math.min(abs-ls,Math.max(0,doc.count));
    functions.deleteCharacterwise(vim,doc.register,abs-count,abs);
    return docs.acc
}
function a$1(vim,doc){
    vim._mode='insert';
    vim._trueCursor.moveRight();
    return docs.ac
}
function dd(vim,doc){
    let c=vim._cursor;
    if(c.r<0)
        return docs.ac
    let count=Math.min(c._countOfRows-c.r,doc.count);
    functions.deleteLinewise(
        vim,
        doc.register,
        c.line(c.r),
        c.line(c.r+count)
    );
    c.moveTo(c.lineStart);
    return docs.acc
}
function gg(vim,doc){
    gotoLine(vim,Math.min(vim._trueCursor._countOfRows,doc.count||1)-1);
    return docs.ac
}
function o$1(vim,doc){
    functions.putLinewise(vim,vim._trueCursor.lineEnd,'\n');
    vim._mode='insert';
    return docs.acc
}
function p$1(vim,doc){
    let reg=vim._registers[doc.register];
    if(!reg)
        return docs.ac
    let s=reg.string.repeat(doc.count);
    if(reg.mode=='string')
        functions.putCharacterwise(vim,vim._trueCursor.abs+1,s);
    else if(reg.mode=='line')
        functions.putLinewise(vim,vim._trueCursor.lineEnd,s);
    return docs.acc
}
function yy(vim,doc){
    let c=vim._cursor;
    if(c.r<0)
        return docs.ac
    let arg=doc.count;
    arg=Math.min(c._countOfRows-c.r,arg);
    let
        a=c.line(c.r),
        b=c.line(c.r+arg);
    functions.yank(
        vim,
        doc.register,
        'line',
        vim._trueText.substring(a,b)
    );
    return docs.ac
}
function x$1(vim,doc){
    let
        abs=vim._trueCursor.abs,
        le=vim._trueCursor.lineEnd,
        count=Math.min(le-1-abs,Math.max(0,doc.count));
    functions.deleteCharacterwise(vim,doc.register,abs,abs+count);
    return docs.acc
}
var functions$1 = {
    D: D$1,
    G: G$1,
    O: O$1,
    P: P$1,
    W:motions.W,
    X: X$1,
    a: a$1,
    dd,
    gg,
    h:motions.h,
    j:motions.j,
    k:motions.k,
    l:motions.l,
    o: o$1,
    p: p$1,
    w:motions.w,
    yy,
    x: x$1,
};

function object(vim,val){
    if(val.ctrlKey){
        if(val.key=='r')
            return String.fromCharCode(17)+'r'
    }else switch(val.key){
        case 'ArrowLeft':
            return 'h'
        case 'ArrowRight':
            return 'l'
        case 'ArrowDown':
            return 'j'
        case 'ArrowUp':
            return 'k'
        case 'Backspace':
            return ascii.bs
        case 'Enter':
            return ascii.cr
        case 'Delete':
            return ascii.del
    }
    return ''
}
function tryCommand(vim,cmd,arg){
    if(cmd=='')
        return {acceptable:true}
    if(cmd[0] in commands)
        return commands[cmd[0]](vim,cmd.substring(1),arg)
}
var normal = (vim,val)=>{
    if(typeof val=='object')
        val=object(vim,val);
    if(!('command' in vim._modeData))
        vim._modeData.command='';
    vim._modeData.command+=val;
    let
        cmd=vim._modeData.command,
        arg;
    if(49<=cmd.charCodeAt(0)&&cmd.charCodeAt(0)<58){
        arg=parseInt(cmd,10);
        cmd=cmd.substring(arg.toString().length);
    }
    let res=tryCommand(vim,cmd,arg)||{};
    if(res.function!=undefined&&res.function in functions$1)
        res=functions$1[res.function](vim,res);
    if(res.acceptable){
        if(res.complete){
            if(res.changed)
                vim._undoBranchManager.push(vim._text);
            if(vim.mode=='normal')
                vim._modeData.command='';
        }
    }else{
        vim._modeData.command='';
    }
    vim._ui();
};

function main(vim,val){
    if(typeof val=='object')
        val=object$1(vim,val);
    if(typeof val=='string'){
        let abs=vim._trueCursor.abs;
        val=val.replace(/\r/,'\n');
        vim._trueText={
            function:'insert',
            position:abs,
            string:val,
        };
        vim._trueCursor.moveTo(abs+val.length);
    }
}
function object$1(vim,val){
    if(
        val.ctrlKey&&val.key=='c'||
        val.ctrlKey&&val.key=='['
    )
        val={key:'Escape'};
    switch(val.key){
        case 'ArrowDown':
            vim._trueCursor.moveDown();
            return
        case 'ArrowLeft':
            vim._trueCursor.moveLeft();
            return
        case 'ArrowRight':
            vim._trueCursor.moveRight();
            return
        case 'ArrowUp':
            vim._trueCursor.moveUp();
            return
        case 'Backspace':
            {
                let abs=vim._trueCursor.abs;
                if(abs==0)
                    return
                vim._text={
                    function:'delete',
                    start:abs-1,
                    end:abs,
                };
                vim._trueCursor.moveTo(abs-1);
            }
            return
        case 'Delete':
            {
                let
                    txt=vim._trueText,
                    abs=vim._trueCursor.abs;
                if(abs+1==txt.length)
                    return
                vim._text={
                    function:'delete',
                    start:abs,
                    end:abs+1,
                };
                vim._trueCursor.moveTo(abs);
            }
            return
        case 'Enter':
            return '\r'
        case 'Escape':
            vim._undoBranchManager.push(vim._text);
            vim._mode='normal';
            return
        case 'Tab':
            {
                let abs=vim._trueCursor.abs;
                vim._text={
                    function:'insert',
                    position:abs,
                    string:'\t',
                };
                vim._trueCursor.moveTo(abs+1);
            }
            return
    }
}
var insert = (vim,val)=>{
    let r=main(vim,val);
    vim._ui();
    return r
};

var visualRange = vim=>{
    let
        c=vim._modeData.cursor,
        d=vim._trueCursor.abs;
    if(d<c)[c,d]=[d,c];
    return {s:c,e:d+1}
};

function main$1(vim,val){
    if(typeof val=='string'){
        if(val=='d'){
            let
                r=visualRange(vim),
                b=vim._text.substring(r.s,r.e);
            vim._text={
                function:'delete',
                start:r.s,
                end:r.e,
            };
            vim._registers['"']={mode:'string',string:b};
            vim._trueCursor.moveTo(r.s);
            vim._mode='normal';
            return
        }
        if(val=='h')
            return vim._trueCursor.moveLeft()
        if(val=='j')
            return vim._trueCursor.moveDown()
        if(val=='k')
            return vim._trueCursor.moveUp()
        if(val=='l')
            return vim._trueCursor.moveRight()
        if(val=='y'){
            let r=visualRange(vim);
            vim._registers['"']={
                mode:'string',
                string:vim._text.substring(r.s,r.e),
            };
            vim._trueCursor.moveTo(r.s);
            vim._mode='normal';
            return
        }
        if(val=='<'){
            let r=visualRange(vim);
            let cursor=Object.create(vim._trueCursor);
            cursor.moveTo(r.s);
            let s=cursor.r;
            cursor.moveTo(r.e);
            let e=cursor.r;
            shift$1.left(vim,s,e+1);
            vim._mode='normal';
            return
        }
        if(val=='>'){
            let r=visualRange(vim);
            let cursor=Object.create(vim._trueCursor);
            cursor.moveTo(r.s);
            let s=cursor.r;
            cursor.moveTo(r.e);
            let e=cursor.r;
            shift$1.right(vim,s,e+1);
            vim._mode='normal';
            return
        }
    }else if(typeof val=='object'){
        if(
            val.key=='Escape'||
            val.ctrlKey&&val.key=='c'||
            val.ctrlKey&&val.key=='['
        )
            return vim._mode='normal'
    }
}
var visual = (vim,val)=>{
    main$1(vim,val);
    vim._ui();
};

let shortcut={
    nu:'number',
};
function main$2(vim,val){
    let enter=false;
    if(typeof val=='object'){
        if(val.key=='ArrowLeft')
            vim._modeData.cursor.position--;
        else if(val.key=='ArrowRight')
            vim._modeData.cursor.position++;
        else if(val.key=='Backspace')
            vim._modeData.cursor.backspace;
        else if(val.key=='Delete')
            vim._modeData.cursor.delete;
        else if(val.key=='End')
            vim._modeData.cursor.end;
        else if(val.key=='Enter')
            enter=true;
        else if(
            val.key=='Escape'||
            val.ctrlKey&&val.key=='c'||
            val.ctrlKey&&val.key=='['
        )
            return vim._mode='normal'
        else if(val.key=='Home')
            vim._modeData.cursor.home;
    }else if(typeof val=='string'){
        vim._modeData.inputBuffer=
            vim._modeData.inputBuffer.substring(
                0,vim._modeData.cursor.position
            )+
            val+
            vim._modeData.inputBuffer.substring(
                vim._modeData.cursor.position
            );
        vim._modeData.cursor.position+=val.length;
    }
    let cmd=vim._modeData.inputBuffer;
    if(!cmd)
        return vim._mode='normal'
    if(!enter)
        return
    let status;
    if(cmd[0]==':'){
        cmd=cmd.substring(1);
        let
            setPattern=/^set?(.*)/,
            editPattern=/^e(?:dit)?(.*)/;
        if(setPattern.test(cmd)){
            status=set(vim,cmd.match(setPattern)[1]);
        }else if(editPattern.test(cmd)){
            status=edit(vim,cmd.match(editPattern)[1]);
        }else if(/^q(?:uit)?$/.test(cmd)){
            vim._quit();
        }else if(/^wq$/.test(cmd)){
            vim._write();
            vim._quit();
        }else if(/^w(?:rite)?$/.test(cmd)){
            status=vim._write();
        }
    }else if(cmd[0]=='/');
    vim._mode='normal';
    if(status)
        vim._modeData.status=status;
}
function edit(vim,cmd){
    let argumentPattern=/ (.*)/;
    if(argumentPattern.test(cmd)){
        cmd=cmd.match(argumentPattern)[1];
        return vim._edit(cmd)
    }
}
function set(vim,cmd){
    let argumentPattern=/ (.*)/;
    if(argumentPattern.test(cmd)){
        cmd=cmd.match(argumentPattern)[1];
        let
            showValuePattern=   /(.*)\?$/,
            argsPattern=        /(.*)[=:](.*)/,
            noPattern=          /^no(.*)/,
            show=       false,
            toSet=      false,
            option,
            value;
        if(showValuePattern.test(cmd)){
            show=true;
            option=cmd.match(showValuePattern)[1];
        }else if(argsPattern.test(cmd)){
            toSet=true;
            option=cmd.match(argsPattern)[1];
            value=parseInt(cmd.match(argsPattern)[2],10);
        }else{
            toSet=true;
            if(noPattern.test(cmd)){
                option=cmd.match(noPattern)[1];
                value=false;
            }else{
                option=cmd;
                value=true;
            }
        }
        if(option in shortcut)
            option=shortcut[option];
        if(toSet){
            if(option in vim._options)
                vim._setOption(option,value);
        }else if(show){
            let v=vim._options[option];
            let res=`${v==false?'no':'  '}${option}`;
            if(typeof v=='number')
                res+=`=${v}`;
            return res
        }
    }
}
var cmdline = (vim,val)=>{
    let r=main$2(vim,val);
    vim._ui();
    return r
};

let modes={normal,insert,visual,cmdline,};
var input = {set(val){
    modes[this.mode](this,val);
}};

let ctx=document.createElement('canvas').getContext('2d');
var measureWidth = (size,s)=>{
    if(s==undefined)
        s='a';
    ctx.font=`${size}px monospace`;
    return ctx.measureText(s).width
};

let moduleNode=`https://gitcdn.link/cdn/anliting/module/${
    '0e94e04505484aaf3b367423b36cf426a4242006'
}/node`;
var npmStringWidthPromise = (async()=>{
    let module=await moduleLoader();
    return module.importByPath(`${moduleNode}/string-width.js`)
})();

var stringWidthPromise = (async()=>{
    let npmStringWidth=await npmStringWidthPromise;
    function charWidth(c){
        if(c=='\t')
            return 8
        return npmStringWidth(c)
    }
    function stringWidth(s){
        let res=0;
        for(let i=0;i<s.length;i++)
            res+=charWidth(s[i]);
        return res
    }
    return stringWidth
})();

let
    lfDoc={
        child:'$',
        class:'color4i',
    };
function substring(list,s,start,end){
    let a=[];
    for(;start!=end;start++){
        let c=s[start];
        a.push(c=='\n'?list?Object.create(lfDoc):'\n':c);
    }
    return a
}
var wrapLinePromise = (async()=>{
    let stringWidth=await stringWidthPromise;
    function width(c){
        return c=='\n'?1:stringWidth(c)
    }
    function wrapLine(list,l,targetWidth){
        let rows=[];
        for(let i=0;i<l.length;){
            let start=i,end=calcEnd(i,l,targetWidth);
            rows.push({
                start,
                end,
                string:substring(list,l,start,end)
            });
            i=end;
        }
        return rows
    }
    function calcEnd(i,l,targetWidth){
        for(
            let rowWidth=0,w;
            i<l.length&&rowWidth+(w=width(l[i]))<=targetWidth;
            rowWidth+=w,i++
        );
        return i
    }
    return wrapLine
})();

function GreedyText(){
    this._options={};
    this.lines=[];
}
GreedyText.prototype._char=function(n){
    return this.lines.slice(0,n).map(v=>v.string.length+1).reduce(
        (a,b)=>a+b,0
    )
};
GreedyText.prototype._line=function(n){
    let i=0,s=0;
    while(i<this.lines.length&&s+this.lines[i].string.length+1<=n)
        s+=this.lines[i++].string.length+1;
    return i
};
Object.defineProperty(GreedyText.prototype,'countOfRows',{get(){
    this.wrap();
    return this.lines.map(l=>l.wrapped.rows.length).reduce((a,b)=>a+b,0)
}});
Object.defineProperty(GreedyText.prototype,'string',{get(){
    return this.lines.map(l=>l.string+'\n').join('')
}});
Object.defineProperty(GreedyText.prototype,'update',{set(val){
    if(typeof val=='string'){
        val=val.split('\n');
        val.pop();
        this.lines=val.map(val=>new Line(val));
    }else if(typeof val=='object'){
        let removeAdd=(s,e,a)=>{
            a=a.split('\n');
            a.pop();
            a=a.map(v=>new Line(v));
            a.unshift(s,e-s)
            ;[].splice.apply(this.lines,a);
        };
        if(val.function=='insert'){
            let l=this._line(val.position);
            let p=val.position-this._char(l);
            let s=(this.lines[l]?this.lines[l].string+'\n':'');
            s=s.substring(0,p)+val.string+s.substring(p);
            removeAdd(l,l+1,s);
        }else if(val.function=='delete'){
            let sl=this._line(val.start),el=this._line(val.end)+2;
            let lc=this._char(sl);
            let start=val.start-lc,end=val.end-lc;
            let s=this.lines.slice(sl,el).map(v=>v.string).join('\n')+'\n';
            s=s.substring(0,start)+s.substring(end);
            removeAdd(sl,el,s);
        }
    }
}});
Object.defineProperty(GreedyText.prototype,'width',{set(val){
    if(this._width!=val)
        this.lines.map(l=>{
            delete l.rows;
        });
    this._width=val;
},get(){
    return this._width
}});
GreedyText.prototype.uiText=function(start,end){
    let res=this.lines.map(l=>l.wrapped);
    return start==undefined?res:cut(res)
    function cut(res){
        return res.map(l=>{
            if(l.startRow+l.rows.length<=start||end<=l.startRow)
                return
            l.rows=l.rows.map((r,i)=>
                inRange(l.startRow+i)&&r
            ).filter(r=>r);
            return l
        }).filter(l=>l!=undefined)
    }
    function inRange(i){
        return start<=i&&i<end
    }
};
GreedyText.prototype.row=function(pos){
    let res;
    this.wrap();
    this.lines.map(l=>l.wrapped).map(l=>l.rows.map((r,i)=>{
        if(l.start+r.start<=pos&&pos<l.start+r.end)
            res=l.startRow+i;
    }));
    return res
};
GreedyText.prototype.setOption=function(key,val){
    this._options[key]=val;
    if(key=='list')
        this.lines.map(l=>{
            delete l.rows;
        });
};
/*
    A line should not include EOL, since it has already been seperated
    from the others.
*/
function Line(val){
    this.string=val;
}
var GreedyTextPromise = (async()=>{
    let wrapLine=await wrapLinePromise;
    GreedyText.prototype.wrap=function(){
        let
            charCount=0,
            rowsCount=0;
        this.lines.map((l,j)=>{
            let s=l.string+'\n';
            if(!l.rows)
                l.rows=wrapLine(this._options.list,s,this.width||Infinity);
            l.wrapped={
                index:j,
                start:charCount,
                startRow:rowsCount,
                rows:l.rows,
            };
            charCount+=s.length;
            rowsCount+=l.rows.length;
        });
    };
    return GreedyText
})();

function update(view){
    if(view._width)
        view.node.style.width=`${view._width*view._fontWidth}px`;
    if(view._height)
        view.node.style.height=`${view._height*view._fontSize}px`;
    view._listeners.map(doc=>
        doc.cli.off('view',doc.listener)
    );
    view._listeners=[];
    {
        let a=dfs(view,view._cli,0,0);
        reuseWrite(view,a,view._previousArray);
        view._previousArray=a;
    }
}
function dfs(view,cli,dr,dc,o){
    o||(o={});
    cli._children.map(c=>{
        let tr=dr+c.r,tc=dc+c.c;
        if(!(0<=tr&&tr<view._height&&0<=tc&&tc<view._width))
            return
        if(typeof c.child=='string'){
            o[tr]||(o[tr]={});
            o[tr][tc]=c;
        }else if(typeof c.child=='symbol')
            view.symbols[c.child]={r:tr,c:tc};
        else
            dfs(view,c.child,tr,tc,o);
    });
    let listener=()=>update(view);
    view._listeners.push({cli,listener});
    cli.on('view',listener);
    return o
}
function reuseWrite(view,a,b){
    let o={};
    for(let r in a)
        for(let c in a[r])
            if(r in b&&c in b[r]&&notEqual(a[r][c],b[r][c]))
                write(view,a[r][c]||'',r,c);
    inNotIn(a,b,(r,c)=>write(view,a[r][c],r,c));
    inNotIn(b,a,(r,c)=>write(view,'',r,c));
    return o
    function notEqual(a,b){
        if(a.child!=b.child)
            return true
        if(a.class!=b.class)
            return true
        if(a.style!=b.style)
            return true
        return false
    }
    function inNotIn(a,b,f){
        for(let r in a)
            for(let c in a[r])
                if(!(r in b&&c in b[r]))
                    f(r,c);
    }
}
function write(view,doc,r,c){
    let
        div=getDiv(view,r,c),
        textContent=doc.child;
    if(textContent=='\n')
        textContent=' ';
    div.className=doc.class||'';
    if(doc.style){
        let span=dom('span');
        for(let i in doc.style)
            span.style[i]=doc.style[i];
        span.textContent=textContent;
        div.textContent='';
        div.appendChild(span);
    }else{
        div.textContent=textContent;
    }
    function getDiv(view,r,c){
        if(!(r in view._divs))
            view._divs[r]={};
        if(!(c in view._divs[r])){
            let div=dom('div');
            div.style.top=`${r*view._fontSize}px`;
            div.style.left=`${c*view._fontWidth}px`;
            view._divs[r][c]=div;
            view.node.appendChild(div);
        }
        return view._divs[r][c]
    }
}

function View(cli){
    this._cli=cli;
    this._fontSize=13;
    this._children=[];
    this._divs={};
    this._listeners=[];
    this._previousArray={};
    this._fontWidth=measureWidth(this._fontSize);
    this.node=dom('div');
    this.node.className='cli';
    this.symbols={};
    update(this);
}
Object.defineProperty(View.prototype,'width',{set(val){
    this._width=val;
    this.update;
},get(){
    return this._width
}});
Object.defineProperty(View.prototype,'height',{set(val){
    this._height=val;
    this.update;
},get(){
    return this._height
}});
Object.defineProperty(View.prototype,'fontSize',{set(val){
    this._fontSize=val;
    this._fontWidth=measureWidth(this._fontSize);
    this.node.style.fontSize=`${this._fontSize}px`;
    this.update;
}});
Object.defineProperty(View.prototype,'update',{set(val){
    update(this);
}});
View.prototype.free=function(){
};

var CliPromise = (async()=>{
    let width=await stringWidthPromise;
    function Cli(){
        EventEmmiter.call(this);
        this._children=[];
    }
    Object.setPrototypeOf(Cli.prototype,EventEmmiter.prototype);
    Object.defineProperty(Cli.prototype,'view',{get(){
        let view=new View(this);
        this.on('view',()=>view.update);
        return view
    }});
    Cli.prototype.clear=function(){
        this._flushed=false;
        this._children=[];
    };
    Cli.prototype.flush=function(){
        if(this._flushed)
            return
        this.emit('view');
        this._flushed=true;
    };
    Cli.prototype.appendChild=function(child){
        this._flushed=false;
        if(
            typeof child=='string'||
            child instanceof Cli
        )
            child={child};
        if(!('r' in child))
            child.r=0;
        if(!('c' in child))
            child.c=0;
        if(typeof child.child=='string'){
            let r=0,c=0;
            for(let i=0;i<child.child.length;i++){
                let chr=child.child[i];
                this._children.push({
                    child:chr,
                    r:child.r+r,
                    c:child.c+c,
                    class:child.class,
                    style:child.style,
                });
                if(chr=='\n'){
                    r++;
                    c=0;
                }else{
                    c+=width(chr);
                }
            }
        }else
            this._children.push(child);
    };
    return Cli
})();

function update$1(ui,cli){
    let vim=ui._vim;
    cli.clear();
    if(vim.mode=='normal'){
        cli.appendChild(vim._modeData.status!=undefined?
            vim._modeData.status
        :
            ''
        );
    }else if(vim.mode=='insert'){
        g('-- INSERT --');
    }else if(vim.mode=='visual'){
        g('-- VISUAL --');
    }else if(vim.mode=='visual-block'){
        g('-- VISUAL BLOCK --');
    }
    cli.appendChild({
        child:cursor(
            ui._vim._cursor.r,
            ui._vim._cursor.c
        ),
        c:ui.width-18
    });
    cli.appendChild({
        child:scroll(
            ui._wrapMethodData._scroll,
            ui._wrapMethodData.text.countOfRows,
            ui.height
        ),
        c:ui.width-4
    });
    cli.flush();
    function cursor(r,c){
        return `${r+1},${c+1}`
    }
    function scroll(s,cr,h){
        let
            top=s==0,
            bot=cr<=s+(h-1);
        if(top&&bot)
            return 'All'
        if(top)
            return 'Top'
        if(bot)
            return 'Bot'
        let n=Math.floor(100*s/(cr-(h-1))).toString();
        return `${' '.repeat(2-n.length)}${n}%`
    }
    function g(s){
        cli.appendChild({child:s,style:{fontWeight:'bold'}});
    }
}
function cmdlineUpdate(ui,cli){
    let vim=ui._vim;
    let
        text=vim._modeData.inputBuffer,
        cursor=vim._modeData.cursor.position;
    cli.clear();
    cli.appendChild(text);
    cli.appendChild({
        child:
            text.substring(cursor,cursor+1)||' ',
        c:cursor,
        class:'cursor',
    });
    cli.flush();
}
var createCommandCliPromise = (async()=>{
    let Cli=await CliPromise;
    function CommandCli(ui){
        this._ui=ui;
        this.cli=new Cli;
        this.update();
    }
    function createCommandCli(ui){
        return new CommandCli(ui)
    }
    CommandCli.prototype.update=function(){
        let
            ui=this._ui,
            cli=this.cli,
            vim=ui._vim;
        if(inNvii(vim.mode))
            update$1(ui,cli);
        else if(vim.mode=='cmdline')
            cmdlineUpdate(ui,cli);
        function inNvii(v){
            return 0<=[
                'normal',
                'insert',
                'visual',
                'visual-block',
            ].indexOf(v)
        }
    };
    return createCommandCli
})();

let highlightStyle={backgroundColor:'var(--middle-color)'};
var createTextContentCliPromise = (async()=>{
    let[
        Cli,
        stringWidth,
    ]=await Promise.all([
        CliPromise,
        stringWidthPromise,
    ]);
    function calcWidth(a){
        let x=0;
        for(let i=0;i<a.length;i++){
            let v=a[i];
            x+=typeof v=='object'?stringWidth(v.child):stringWidth(v);
        }
        return x
    }
    function createTextContentCli(
        text,
        cursor,
        showCursor,
        highlightRange,
        cursorSymbol,
        width
    ){
        let cli=new Cli,rowsCount;
        {
            let
                currentRowsCount=0;
            text.map(l=>{
                if(!l.rows.length)
                    currentRowsCount++;
                l.rows.map(row=>{
                    let rowStart=l.start+row.start;
                    for(
                        let i=0,c=0;
                        i<row.string.length;
                        c+=calcWidth(row.string[i++])
                    ){
                        let o=row.string[i];
                        if(typeof o=='string')
                            o={child:o};
                        else
                            o={
                                child:o.child,
                                class:o.class,
                                style:o.style,
                            };
                        o.r=currentRowsCount;
                        o.c=c;
                        if(
                            highlightRange&&
                            highlightRange.s<=rowStart+i&&
                            rowStart+i<highlightRange.e
                        )
                            o.style=highlightStyle;
                        cli.appendChild(o);
                    }
                    currentRowsCount++;
                });
            });
            rowsCount=currentRowsCount;
        }
        if(showCursor){
            let c;
            c=cursor;
            c=cursorCli(text,{
                r:c.r,
                c:c.c==-1?0:c.c
            },width);
            if(c){
                cli.appendChild(c);
                cli.appendChild({
                    child:cursorSymbol,
                    r:c.r,
                    c:c.c,
                });
            }
        }
        return {
            textCli:cli,
            rowsCount,
        }
    }
    function cursorCli(text,vc,width){
        let currentRowsCount=0;
        let clientCursor;
        text.map(l=>{
            if(!l.rows.length)
                currentRowsCount++;
            l.rows.map(row=>{
                if(
                    l.index==vc.r&&
                    row.start<=vc.c&&vc.c<row.start+row.string.length
                ){
                    let viewC=width?vc.c-row.start:vc.c;
                    clientCursor={
                        row:currentRowsCount,
                        col:calcWidth(row.string.slice(0,viewC)),
                        doc:row.string[viewC],
                    };
                }
                currentRowsCount++;
            });
        });
        if(!clientCursor)
            return
        if(typeof clientCursor.doc!='object')
            clientCursor.doc={child:clientCursor.doc};
        clientCursor.doc=Object.create(clientCursor.doc);
        clientCursor.doc.child=clientCursor.doc.child||' ';
        clientCursor.doc.r=clientCursor.row;
        clientCursor.doc.c=clientCursor.col;
        if(clientCursor.doc.class)
            clientCursor.doc.class=`${clientCursor.doc.class} cursor`;
        else
            clientCursor.doc.class='cursor';
        return clientCursor.doc
    }
    return createTextContentCli
})();

let
    color3i={
        color:'var(--color3i)'
    },
    color4i={
        color:'var(--color4i)'
    };
var buildPromise = (async()=>{
    let[
        Cli,
        createTextContentCli,
    ]=await Promise.all([
        CliPromise,
        createTextContentCliPromise,
    ]);
    function build(cli,ui,showCursor,showNumber){
        let 
            cursor= ui._vim._trueCursor,
            width=  ui._width,
            height= ui._height,
            data=   ui._wrapMethodData,
            txt=    data.text;
        let numberWidth=ui._numberWidth;
        let textWidth=ui._textWidth;
        let text=data.text.uiText(data._scroll,data._scroll+height-1);
        let res=createTextContentCli(
            text,
            cursor,
            showCursor,
            ui._vim._mode=='visual'&&visualRange(ui._vim),
            ui._cursorSymbol,
            width
        );
        if(showNumber){
            cli.appendChild(number(text,numberWidth));
            cli.appendChild({
                child:res.textCli,
                c:numberWidth+1,
            });
        }else{
            cli.appendChild(res.textCli);
        }
        for(let r=res.rowsCount;r<ui.height-1;r++)
            cli.appendChild({
                child:'~',
                r,
                style:color4i
            });
        return cli
    }
    function number(text,numberWidth){
        let cli=new Cli;
        let currentRowsCount=0;
        text.map(l=>{
            cli.appendChild({
                child:pad((l.index+1).toString()),
                r:currentRowsCount,
                style:color3i
            });
            currentRowsCount+=l.rows.length||1;
        });
        return cli
        function pad(s){
            return ' '.repeat(numberWidth-s.length)+s
        }
    }
    return build
})();

var createTextCliPromise = (async()=>{
    let[
        Cli,
        build,
    ]=await Promise.all([
        CliPromise,
        buildPromise,
    ]);
    function createTextCli(ui){
        return new TextCli(ui)
    }
    function TextCli(ui){
        this._ui=ui;
        this._updated=false;
        this.cli=new Cli;
        this.flush();
    }
    TextCli.prototype.update=function(){
        this._updated=false;
    };
    TextCli.prototype.flush=function(){
        if(this._updated)
            return
        this.cli.clear();
        build(
            this.cli,
            this._ui,
            document.activeElement==this._ui._inputTag&&
                this._ui._vim.mode!='cmdline',
            this._ui._vim._options.number
        );
        this.cli.flush();
        this._updated=true;
    };
    return createTextCli
})();

var createInput = (ui=>{
    let vim=ui._vim;
    let textarea=dom('textarea',{className:'input'});
    textarea.style.fontSize=`${ui._fontSize}px`;
    textarea.style.height=`${ui._fontSize+2}px`;
    let composing=false;
    textarea.addEventListener('blur',()=>{
        vim._ui();
    });
    textarea.addEventListener('compositionstart',e=>{
        composing=true;
    });
    textarea.addEventListener('compositionend',e=>{
        composing=false;
        f();
    });
    textarea.addEventListener('focus',()=>{
        vim._ui();
    });
    textarea.addEventListener('input',()=>{
        f();
    });
    textarea.addEventListener('keydown',e=>{
        if(composing||!(
            e.key=='ArrowLeft'||
            e.key=='ArrowRight'||
            e.key=='ArrowDown'||
            e.key=='ArrowUp'||
            e.key=='Backspace'||
            e.key=='Delete'||
            e.key=='End'||
            e.key=='Enter'||
            e.key=='Escape'||
            e.key=='Home'||
            e.key=='Tab'||
            e.ctrlKey&&e.key=='c'||
            e.ctrlKey&&e.key=='['||
            e.ctrlKey&&e.key=='r'
        ))
            return
        e.preventDefault();
        e.stopPropagation();
        vim.input=e;
    });
    return textarea
    function f(){
        if(composing){
            vim._ui();
        }else{
            vim.input=textarea.value;
            textarea.value='';
        }
        let width=measureWidth(ui._fontSize,textarea.value);
        if(width)
            width+=2;
        textarea.style.width=`${width}px`;
    }
});

var createCliDivPromise = (async()=>{
    let[
        createCommandCli,
        Cli,
        createTextCli,
    ]=await Promise.all([
        createCommandCliPromise,
        CliPromise,
        createTextCliPromise,
    ]);
    function createCliDiv(ui){
        return new CliDiv(ui)
    }
    function CliDiv(ui){
        this._ui=ui;
        this._vim=this._ui._vim;
        this._cli=new Cli;
        this._cliView=this._cli.view;
        this._ui._commandCli=createCommandCli(this._ui);
        this._cliView.fontSize=this._ui._fontSize;
        this._textCli=createTextCli(this._ui);
        this.update();
        let n=this._cliView.node;
        this._ui._inputTag=createInput(this._ui);
        n.appendChild(this._ui._inputTag);
        this.node=n;
    }
    CliDiv.prototype.modeChange=function(){
        this._ui._commandCli.update();
    };
    CliDiv.prototype.update=function(){
        let ui=this._ui;
        ui._wrapMethodData.text.width=ui._textWidth;
        ui._wrapMethodData.text.wrap();
        ui._checkScroll();
        this._textCli.update();
        this._ui._commandCli.update();
        if(this._cliView.width!=this._ui._width)
            this._cliView.width=this._ui._width;
        if(this._cliView.height!=this._ui._height)
            this._cliView.height=this._ui._height;
        {let c;if(c=this._cliView.symbols[this._ui._cursorSymbol]){
            this._ui._inputTag.style.top=`${c.r*this._ui._fontSize}px`;
            this._ui._inputTag.style.left=`${c.c*this._ui._fontWidth}px`;
        }}
        let r=this._ui._height-1;
        if(
            this._currentR==r&&
            this._currentWelcomeText==this._vim._welcomeText
        )
            return
        this._cli.clear();
        this._cli.appendChild(this._textCli.cli);
        this._cli.appendChild({
            child:this._ui._commandCli.cli,
            r,
        });
        if(
            this._vim._welcomeText&&
            50<=this._ui.width&&
            16<=this._ui.height
        ){
            let
                r=Math.floor(
                    (
                        this._ui.height-
                        this._vim._welcomeText.split('\n').length-1
                    )/2
                ),
                c=Math.floor(
                    (this._ui.width-this._vim._welcomeText.split(
                        '\n'
                    ).map(
                        s=>s.length
                    ).reduce(
                        (a,b)=>Math.max(a,b)
                    ))/2
                );
            this._cli.appendChild({
                child:this._vim._welcomeText,
                r,
                c,
            });
        }
        this._cli.flush();
        this._currentR=r;
        this._currentWelcomeText=this._vim._welcomeText;
    };
    CliDiv.prototype.flush=function(){
        this._textCli.flush();
    };
    return createCliDiv
})();

var createViewNodePromise = (async()=>{
    let[
        createCliDiv,
    ]=await Promise.all([
        createCliDivPromise,
    ]);
    function createViewNode(ui){
        let cliDiv=createCliDiv(ui);
        let n=cliDiv.node;
        n.classList.add('webvim');
        n.addEventListener('click',()=>
            ui._vim.focus()
        );
        return cliDiv
    }
    return createViewNode
})();

function optionChange(ui,options){
    for(let k of options)switch(k){
        case 'list':
            if(ui._wrapMethod=='greedy')
                ui._wrapMethodData.text.setOption(
                    'list',ui._vim._options[k]
                );
            break
        case 'number':
            ui._wrapMethodData.text.width=ui._textWidth;
            break
    }
}
function _updateByVim(changed){
    for(let k in changed){let v=changed[k];
        switch(k){
            case 'mode':
                this._viewNode.modeChange();
                break
            case 'text':
                if(this._wrapMethod=='greedy'){
                    if(this._sync&&this._vim._text!='')
                        v.map(u=>
                            this._wrapMethodData.text.update=u
                        );
                    else
                        this._wrapMethodData.text.update=
                            this._vim._trueText;
                    this._sync=
                        this._vim._text==this._wrapMethodData.text.string;
                }
                break
            case 'options':
                optionChange(this,Object.keys(v));
                break
        }
    }
    this._update();
}

var uiPromise = (async()=>{
    let[
        createViewNode,
        GreedyText,
    ]=await Promise.all([
        createViewNodePromise,
        GreedyTextPromise,
    ]);
    function Ui(vim){
        this._values={};
        this._vim=vim;
        this._width=80;
        this._height=24;
        this._fontSize=13;
        this._wrapMethod='greedy';
        this._cursorSymbol=Symbol();
        this._viewNode=createViewNode(this);
        this.node=this._viewNode.node;
        setUpClock(this);
    }
    Object.defineProperty(Ui.prototype,'_fontSize',{set(v){
        this._values._fontSize=v;
        this._values._fontWidth=measureWidth(this._fontSize);
    },get(){
        return this._values._fontSize
    }});
    Object.defineProperty(Ui.prototype,'_fontWidth',{get(){
        return this._values._fontWidth
    }});
    Object.defineProperty(Ui.prototype,'_numberWidth',{get(){
        return Math.max(3,Math.floor(
            Math.log(this._vim._trueCursor._countOfRows)/Math.log(10)
        )+1)
    }});
    Object.defineProperty(Ui.prototype,'_textWidth',{get(){
        return this._vim._options.number?
            this._width-(this._numberWidth+1)
        :
            this._width
    }});
    Ui.prototype._checkScroll=function(){
        let
            height=         this._height,
            data=           this._wrapMethodData,
            txt=            data.text,
            c=              this._vim._trueCursor,
            cursorViewRow=  txt.row(c._countOfCols==0?c.line(c.r):c.abs);
        if(data._scroll+height-1<=cursorViewRow)
            data._scroll=cursorViewRow-(height-1)+1;
        if(cursorViewRow<data._scroll)
            data._scroll=cursorViewRow;
    };
    Ui.prototype._update=function(){
        this._viewNode.update();
    };
    Ui.prototype._updateByVim=_updateByVim;
    Object.defineProperty(Ui.prototype,'_wrapMethod',{set(val){
        this._values.wrapMethod=val;
        if(this._values.wrapMethod=='greedy'){
            let text=new GreedyText;
            text.width=this._textWidth;
            text.update=this._vim._trueText;
            text.setOption('list',this._vim._options.list);
            this._wrapMethodData={
                _scroll:0,
                text,
            };
        }else if(this._values.wrapMethod=='fixed'){
            this._wrapMethodData={
                _scroll:0,
            };
        }
    },get(){
        return this._values.wrapMethod
    }});
    Object.defineProperty(Ui.prototype,'width',{set(val){
        this._width=val;
        this._update();
    },get(){
        return this._width
    }});
    Object.defineProperty(Ui.prototype,'height',{set(val){
        this._height=val;
        this._update();
    },get(){
        return this._height
    }});
    Ui.prototype.focus=function(){
        this._inputTag.focus();
    };
    Object.defineProperty(Ui.prototype,'free',{get(){
        tearDownClock(this);
        this._vim.removeUi(this);
    }});
    function setUpClock(ui){
        let f=()=>{
            ui._animationFrame=requestAnimationFrame(f);
            ui._viewNode.flush();
        };
        ui._animationFrame=requestAnimationFrame(f);
    }
    function tearDownClock(ui){
        cancelAnimationFrame(ui._animationFrame);
        delete ui._animationFrame;
    }
    return {get(){
        let ui=new Ui(this);
        this._uis.add(ui);
        return ui
    }}
})();

var loadUserInterface = (async()=>{
    let[
        ui,
    ]=await Promise.all([
        uiPromise,
    ]);
    return o=>{
        Object.defineProperty(o,'cursor',{get(){
            return this._cursor.abs
        }});
        Object.defineProperty(o,'mode',{get(){
            return this._mode
        }});
        Object.defineProperty(o,'text',{
            set(val){
                this._text=val;
                this._welcomeText=undefined;
                this._undoBranchManager.clear();
                this._undoBranchManager.push(this._text);
                this._ui();
            },get(){
                return this._text
            }
        });
        o.focus=function(){
            this._mainUi.focus();
        };
        Object.defineProperty(o,'input',input);
        Object.defineProperty(o,'ui',ui);
    }
})();

var loadSyntacticSugar = o=>{
    Object.defineProperty(o,'node',{get(){
        return this._mainUi.node
    }});
    Object.defineProperty(o,'height',{set(val){
        this._mainUi.height=val;
    }});
    Object.defineProperty(o,'width',{set(val){
        this._mainUi.width=val;
    }});
    Object.defineProperty(o,'pollute',{get(){
        this.polluteStyle;
        this.polluteCopy;
    }});
    Object.defineProperty(o,'polluteStyle',{get(){
        document.head.appendChild(this.style);
        this.once('quit',()=>{
            document.head.removeChild(this.style);
        });
    }});
    Object.defineProperty(o,'polluteCopy',{get(){
        this.copy=s=>{
            let n=dom('textarea',{value:s});
            n.style.position='fixed';
            let e=document.activeElement;
            dom(document.body,n);
            n.select();
            document.execCommand('copy',true,null);
            document.body.removeChild(n);
            if(e)
                e.focus();
        };
    }});
};

var colorsStyle = `div.webvim.cli{
    --color3i:yellow;
    --color4:blue;
    --color4i:dodgerblue;
    --background-color:black;
    --foreground-color:lightgray;
    --middle-color:gray;
    --cursor-bg:var(--foreground-color);
    --cursor-fg:var(--background-color);
}
div.webvim.cli .color4i{
    color:var(--color4i);
    --cursor-bg:var(--color4i);
    --cursor-fg:var(--background-color);
}
div.webvim.cli .cursor{
    background-color:var(--cursor-bg);
    color:var(--cursor-fg);
}
`;

function Cursor$1(vim){
    this._x=0;
    this._y=0;
}
// start 0
Object.defineProperty(Cursor$1.prototype,'_countOfRows',{get(){
    return this.text.split('\n').length-1
}});
Object.defineProperty(Cursor$1.prototype,'_countOfCols',{get(){
    return this.text?this.text.split('\n')[this.r].length:0
}});
Object.defineProperty(Cursor$1.prototype,'_exotic',{get(){
    let c=Object.create(this);
    Object.defineProperty(c,'_x',{set:val=>this._x=val,get:()=>this._x});
    Object.defineProperty(c,'_y',{set:val=>this._y=val,get:()=>this._y});
    return c
}});
Object.defineProperty(Cursor$1.prototype,'r',{set(val){
    this._y=val;
},get(){
    return Math.min(this._countOfRows-1,Math.max(0,this._y))
}});
Object.defineProperty(Cursor$1.prototype,'c',{set(val){
    this._x=val;
},get(){
    return Math.min(availableCols(this)-1,Math.max(0,this._x))
}});
function availableCols(c){
    if(
        c.mode=='normal'||
        c.mode=='cmdline'
    )
        return c._countOfCols
    if(
        c.mode=='visual'||
        c.mode=='insert'
    )
        return c._countOfCols+1
}
Cursor$1.prototype.line=function(n){
    return this.text.split('\n').slice(0,n).join('').length+n
};
// end 0
// start 1
Cursor$1.prototype.moveLeft=function(){
    this._x=Math.max(0,this.c-1);
};
Cursor$1.prototype.moveRight=function(){
    this._x=Math.min(availableCols(this)-1,this.c+1);
};
Cursor$1.prototype.moveUp=function(){
    this._y=Math.max(0,this._y-1);
};
Cursor$1.prototype.moveDown=function(){
    this._y=Math.min(this._countOfRows-1,this._y+1);
};
// end 1
// start 1a
Object.defineProperty(Cursor$1.prototype,'onChar',{get(){
    return 0<=this.c
}});
Object.defineProperty(Cursor$1.prototype,'abs',{get(){
    return (0<=this.r?this.line(this.r):0)+(0<=this.c?this.c:0)
}});
// end 1a
// start 1b
Cursor$1.prototype.moveTo=function(n){
    this._y=this.text.substring(0,n).split('\n').length-1;
    this._x=n-(
        this.text.split('\n').slice(0,this.r).join('').length+this.r
    );
};
// end 1b
// start 1c
Object.defineProperty(Cursor$1.prototype,'lineStart',{get(){
    return this.text.substring(0,this.abs).lastIndexOf('\n')+1
}});
Object.defineProperty(Cursor$1.prototype,'lineEnd',{get(){
    let a=this.abs;
    return a+this.text.substring(a).indexOf('\n')+1
}});
// end 1c
// start 2
Cursor$1.prototype.moveToEOL=function(){
    this.moveTo(this.lineEnd-1);
};
// end 2
// start 2a; start github.com/b04902012
{
    function charType(text,a){
        if(text[a]==='\n'&&(!a||text[a-1]==='\n'))
            return "EmptyLine"
        if(/^\s$/.test(text[a]))
            return "WhiteSpace"
        if(/^\w$/.test(text[a]))
            return "AlphaNumeric"
        if(/^[\x00-\x7F]*$/.test(text[a]))
            return "ASCII"
        return "NonASCII"
    }
    Cursor$1.prototype.moveWordRight=function(){
        let a=this.abs;
        let t=charType(this.text,a);
        let b=false;
        while(a<this.text.length-1&&
          [(b||t),"WhiteSpace"].includes(charType(this.text,a))
        ){
            b=b||(charType(this.text,a)==="WhiteSpace");
            a++;
            if(charType(this.text,a)==="EmptyLine")break
        }
        this.moveTo(a);
    };
    Cursor$1.prototype.moveGeneralWordRight=function(){
        let a=this.abs;
        let t=charType(this.text,a);
        let b=false;
        while(a<this.text.length-1&&
          (!b||charType(this.text,a)==="WhiteSpace")
        ){
            b=b||(charType(this.text,a)==="WhiteSpace");
            a++;
            if(charType(this.text,a)==="EmptyLine")
              break
            if(t==="EmptyLine"&&charType(this.text,a)!=="WhiteSpace")
              break
        }
        this.moveTo(a);
    };
}

function createCursor(vim){
    let cursor=new Cursor$1,trueCursor=cursor._exotic;
    Object.defineProperty(cursor,'text',{configurable:true,get(){
        return vim._text
    }});
    Object.defineProperty(cursor,'mode',{get(){
        return vim._mode
    }});
    Object.defineProperty(trueCursor,'text',{get(){
        return vim._trueText
    }});
    return [cursor,trueCursor]
}

var rc = vim=>{
    let vimrc=vim._read('~/.vimrc');
    if(vimrc==undefined)
        return
    vimrc.split('\n').map(c=>{
        if(!c)
            return
        vim._mode='cmdline';
        vim._modeData.inputBuffer=':';
        vim._modeData.cursor.position=1;
        vim.input=c;
        vim.input={key:'Enter'};
    });
};

var defaultOptions = {
    expandtab:  false,
    list:       false,
    number:     false,
    shiftwidth: 8,
    tabstop:    8,
};

function StyleManager(){
    this.style=dom.style();
}
StyleManager.prototype.appendChild=function(n){
    dom(this.style,n);
};

function UndoBranchManager(){
    this._undoBranches=[];
}
UndoBranchManager.prototype.clear=function(){
    this._undoBranches=[];
    delete this.current;
};
UndoBranchManager.prototype.push=function(text){
    let b=new UndoBranch(text);
    this._undoBranches.push(b);
    if(this.current!=undefined){
        this.current.next=b;
        b.previous=this.current;
    }
    this.current=b;
};
UndoBranchManager.prototype.gotoPrevious=function(){
    if(this.current.previous!=undefined){
        let b=this.current.previous;
        this.current=b;
        return b.text
    }
};
function UndoBranch(text){
    this.text=text;
}

var style = `div.webvim.cli{
    position:relative;
    font-family:monospace;
    white-space:pre;
    line-height:1;
    color:var(--foreground-color);
    background-color:var(--background-color);
    cursor:default;
    user-select:none;
}
div.webvim.cli>div{
    position:absolute;
}
div.webvim.cli>textarea.input{
    font-family:monospace;
    position:absolute;
    border:0;
    padding:0;
    resize:none;
    overflow:hidden;
    outline:none;
    width:0;
    color:var(--background-color);
    background-color:var(--foreground-color);
    z-index:1;
}
`;

var Vim = (async()=>{
    let load=[
        loadBase,
        loadUserInterface,
        loadSyntacticSugar,
    ];
    function Vim(read,write){
        EventEmmiter.call(this);
        this._values={
            mode:'normal'
        };
        this._options=Object.create(defaultOptions);
        this._viewChanged=[];
        this._text='';
        this._registers={};
        this._modeData={};
        {let a=createCursor(this);
            this._cursor=a[0];
            this._trueCursor=a[1];
        }
        this._undoBranchManager=new UndoBranchManager;
        this._undoBranchManager.push(this._text);
        this._styleManager=new StyleManager;
        this.style=this._styleManager.style;
        this._styleManager.appendChild(document.createTextNode(style));
        this._styleManager.appendChild(document.createTextNode(colorsStyle));
        this.read=read;
        this.write=write;
        this._uis=new Set;
        rc(this);
    }
    Object.setPrototypeOf(Vim.prototype,EventEmmiter.prototype)
    ;(await Promise.all(load)).map(f=>f(Vim.prototype));
    return Vim
})();

export default Vim;
