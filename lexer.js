/**
 * @author xieyanghao
 * @date 2020-2020/2/22-5:20 下午
 */
"use strict";

let html = `<header>
    <nav>
        <ul>
            <li>首页</li>
            <li>dashboard</li>
            <li>个人中心</li>
            <li>退出登录</li>
        </ul>
    </nav>
</header><main>
    <p>
        this is a p
    </p>
    <img src="./wenwen.jpeg" alt="呜呜呜">
</main><footer>
    <address>
        mail: xie5997231@gmail.com<br>
        address: Futian,Shenzhen,Guangdong,China
    </address>
</footer>`;

html = html.replace(/[\s\n\r ]+/g, " ");

let example = {
    type: "startTag || endTag || Text || selfCloseTag ",
    name: "tagName",
    attrs: {
        key: "value"
    }
};

class HTMLLexicalParser {
    constructor(html) {
        this.state = this.start;
        this.tokens = [];
        this.token = null;
        this.init(html);
    }

    init(html) {
        for (let c of html) {
            this.state(c);
        }
        return this.tokens;
    }

    start(c) {
        if (c === "<") {
            return this.state = this.tagOpen
        }
        if (c === ">") {
            return this.error();
        }
        if (/[\t\n\f ]/.test(c)) {
            return this.state = this.start;
        }
        this.token = new Text();
        this.token.value = c;
        return this.state = this.getText;
    }

    getText(c) {
        if (c === "<") {
            this.emitToken(this.token);
            return this.state = this.tagOpen;
        }
        if (c === ">") {
            return this.error();
        }
        this.token.value += c;
        return this.state = this.getText;
    }

    tagOpen(c) {
        if (c === "/") {
            return this.state = this.endTagOpen;
        }
        if (/[a-zA-Z]/.test(c)) {
            this.token = new StartTag();
            this.token.name = c.toLowerCase();
            this.token.attrs = {};
            return this.state = this.tagName;
        }
        return error(c);
    }

    endTagOpen(c) {
        if (/[a-zA-Z]/.test(c)) {
            this.token = new EndTag();
            this.token.name = c.toLowerCase();
            return this.state = this.endTagName;
        }
        if (c === ">") {
            return this.error(c);
        }
    }

    tagName(c) {
        if (/[a-zA-Z]/.test(c)) {
            this.token.name += c.toLowerCase();
            return this.state = this.tagName;
        }
        if (c === "/") {
            return this.state = this.selfCloseingTag;
        }
        if (c === ">") {
            this.emitToken(this.token);
            return this.state = this.start;
        }
        if (/[\t\n\f ]/.test(c)) {
            return this.state = this.waitForAttrs;
        }
    }

    waitForAttrs(c) {
        if (/[ \t\f\n]/.test(c)) {
            return this.state = this.waitForAttrs;
        }
        if (/[a-zA-Z]/.test(c)) {
            this.attrs = new Attribute();
            this.attrs.name = c.toLowerCase();
            this.attrs.value = '';
            return this.state = this.attrName;
        }
        if (c === ">") {
            this.emitToken(this.token);
            return this.state = this.start;
        }
        if (c === "/") {
            return this.state = this.selfCloseingTag;
        }
        return this.error(c);
    }

    attrName(c) {
        if (/[a-zA-Z]/.test(c)) {
            this.attrs.name += c;
            return this.state = this.attrName;
        }
        if (c === "=") {
            return this.state = this.beforeAttrVal;
        }
        if (c === " ") {
            this.attrs.value = true;
            this.token.attrs[this.attrs.name] = this.attrs.value;
            return this.state = this.waitForAttrs;
        }
        return this.error(c);
    }

    beforeAttrVal(c) {
        if (c === "'") {
            return this.state = this.attributeValueSingleQuoted;
        }
        if (c === '"') {
            return this.state = this.attributeValueDoubleQuoted;
        }
        if (/[\t\f\n ]/.test(c)) {
            return this.state = this.beforeAttrVal;
        }
        return this.error(c);
    }

    attributeValueSingleQuoted(c) {
        if (c === "'") {
            this.token.attrs[this.attrs.name] = this.attrs.value;
            return this.state = this.waitForAttrs;
        }
        this.attrs.value += c;
        return this.state=this.attributeValueSingleQuoted;
    }

    attributeValueDoubleQuoted(c) {
        if (c === '"') {
            this.token.attrs[this.attrs.name] = this.attrs.value;
            return this.state = this.waitForAttrs;
        }
        this.attrs.value += c;
        return this.state = this.attributeValueDoubleQuoted;
    }

    endTagName(c) {
        if (/[a-zA-Z]/.test(c)) {
            this.token.name += c.toLowerCase();
            return this.state = this.endTagName;
        }
        if (c === ">") {
            this.emitToken(this.token);
            return this.state = this.start;
        }
        return this.error(c);
    }

    selfCloseingTag(c) {
        if (c === ">") {
            console.log(this.token);
            this.emitToken(this.token);
            let endToken = new EndTag();
            endToken.name = this.token.name;
            this.emitToken(endToken);
            return this.state = this.start;
        }
    }

    emitToken(token) {
        this.tokens.push(token);
    }

    error(c) {
        console.warn(`unexcited char ${c}`);
    }
}

class StartTag {

}

class EndTag {
    
}

class Attribute {
    
}

class Text {}

let items = new HTMLLexicalParser(html).tokens;

class DOMTree{
    constructor(tagName, props, children) {
        this.tagName = tagName;
        this.props = props?props: {};
        this.children = children?children: [];
    }

    render() {
        let el = document.createElement(this.tagName);
        let props = this.props;
        for (let prop in props) {
            el.setAttribute(prop, this.props[prop]);
        }
        for (let child of this.children) {
            let childEl = child instanceof DOMTree ? child.render() : document.createTextNode(child);
            el.appendChild(childEl);
            // if (child instanceof DOMTree) {
            //     el.appendChild(this.render(child));
            // } else {
            //     el.appendChild(document.createTextNode(child));
            // }
        }
        return el;
    }
}

const root = new DOMTree('div');

let stack = [root];

let current = stack[stack.length - 1];

for (let item of items) {
    if (item instanceof StartTag) {
        let el = new DOMTree(item.name, item.attrs, []);
        current.children.push(el);
        if (item.name === "br" || item.name === "img") {
        } else {
            stack.push(el);
        }
    } else if (item instanceof EndTag) {
        stack.pop();
    } else if (item instanceof Text) {
        current.children.push(item.value);
    }
    current = stack[stack.length - 1];
}

let app = document.getElementById("app");
app.appendChild(root.render());