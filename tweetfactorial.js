/*
 * 
 * We implement the huge numbers we need as a array of digits
 * which is hardly efficient, yet easy to understand. So, say, 1256 becomes [ 6, 5, 2, 1 ] 
 * We will not use the Math library.
 * 
 */

class BigCard {
    constructor() {
        this.n = [ 0 ];
    }
    
    isOdd() {
        // we need this for multiplication
        return this.n.length && (this.n[0] % 2);
    }
    
    isZero() {
        // convenience function
        if(this.n.length > 1)
            return false;
        if(this.n.length == 0)
            return true;
        return this.n[0] == 0 ? true : false;
    }
    
    setN(x) {
        // convenience function
        this.n = [ ];
        if(x.n.length)
            x.n.forEach( d => this.n.push(d) );
        else
            this.n = [ 0 ];
    }
        
    lt(x) {
        // we need this function for arithmetics. Returns true if this.n < x, false otherwise
        if( this.n.length < x.n.length )
            return true;
        if( this.n.length > x.n.length )
            return false;
        for(let i = x.n.length - 1; i >= 0; i--) {
            if(this.n[i] < x.n[i])
                return true;
            if(this.n[i] > x.n[i])
                return false;
        }
        return false;
    }
    
    incrDigit(d) {
        /* helper function: this.n[d] = this.n[d] + 1 
         * note: x.incrDigit(0) is the same as incrementing the number x by 1;
         */
        if(d >= this.n.length) {
            for(let i = 0; i < d - this.n.length - 1; i++)
                this.n.push(0);
            this.n.push(1);
            return;
        }
        if(this.n[d] == 9) {
            this.n[d] = 0;
            this.incrDigit(d+1);
            return;
        }
        this.n[d]++
    }
    
    incr() { this.incrDigit(0) }
    
    decrDigit(d) {
        /* helper function this.n[d] = this.n[d] - 1 */
        if(this.isZero())
            return;
        if(d >= this.n.length)
            return;
        if(this.n[d] == 0) {
            this.n[d] = 9;
            this.decrDigit(d+1);
            return;
        }
        this.n[d]--;
        if(this.n.length > 1 && this.n[this.n.length - 1] == 0)
            this.n.pop();
    }
    
    decr() { this.decrDigit(0) }
    
    addDigit(a,d) {
        // helper for addition: this.n[d] = this.n[d] + a
        if(a == 0)
            return;
        if(d >= this.n.length) {
            for(let i = this.n.length; i < d; i++)
                this.n.push(0);
            this.n.push(a);
            return;
        }
        this.n[d] += a;
        if(this.n[d] < 10)
            return;
        this.n[d] -= 10;
        this.incrDigit(d+1);
    }
    
    add(x) {
        // we need this function for the multiplication. Adds x to this
        if(this.lt(x)) {
            let y = new BigCard();
            y.setN(x);
            y.add(this);
            this.setN(y);
            return;
        }
        // this >= x
        const c = this.n.length;
        const d = x.n.length;
        let   s = new BigCard();
        s.setN(this);
        for(let i = 0; i < c; i++) {
            if(i >= d) {
                this.setN(s);
                return;
            }
            s.addDigit(x.n[i],i);
        }
        this.setN(s);    
    }
    
    double() { this.add(this) } // for multiplication
    
    half() { 
        // for multiplication
        const c = this.n.length;
        for(let i = c - 1; i >= 0; i--) {
            if(this.n[i] % 2) {
                this.n[i]--;
                this.n[i-1] += 5;
                i++;
            } else {
                this.n[i] /= 2;
            }
        }
        if(this.n.length > 1 && this.n[this.n.length - 1] == 0)
            this.n.pop();
    }
    
    mult(x) { 
        /* this = this * x
         * 
         * you might find this way of multiplying two numbers rather strange. However,
         * it is far more efficient than the intuitive way of adding x times the number
         * this. If you're not familiar with the algorithm, try to understand it!
         * 
         */
        if(this.lt(x)) {
            let y = new BigCard();
            y.setN(x);
            y.mult(this);
            this.setN(y);
            return;
        }
        // at this point this >= x
        let s = new BigCard();
        let y = new BigCard();
        y.setN(x);
        while(!y.isZero()) {
            if(y.isOdd()) {
                s.add(this);
                y.decr();
            } else {
                this.double();
                y.half();
            }
        }
        this.setN(s);
    }
    
    str() {
        // returns the number this as string
        let s = "";
        if(this.isZero())
            return "0";
        for(let i = this.n.length - 1; i >= 0; i--)
            s = s + this.n[i];
        return(s);
    }
}

// global functions
function restoreButton() {
    document.getElementsByTagName("BUTTON")[0].classList.remove("pressed");
}

function nextFak() {
    document.getElementsByTagName("BUTTON")[0].classList.add("pressed");
    baseNumber.incr();
    factorial.mult(baseNumber);
    const p  = document.createElement("P");
    let   q  = document.createElement("P");
    q.classList.add("numberHeader");
    let   b  = document.createElement("B");
    b.appendChild(document.createTextNode(baseNumber.str()));
    b.appendChild(document.createTextNode("!"));
    q.appendChild(b);
    q.appendChild(document.createTextNode(" "));
    b = document.createElement("B");
    q.appendChild(document.createTextNode(factorial.n.length));
    q.appendChild(b);
    q.appendChild(document.createTextNode(" digits"));
    p.appendChild(q);
    q = document.createElement("P");
    q.classList.add("faktorial");
    b = document.createElement("B");
    b.appendChild(document.createTextNode(factorial.str()));
    q.appendChild(b);
    p.appendChild(q);
    document.getElementById("numbers").prepend(p);
    setTimeout(restoreButton,200);
}
