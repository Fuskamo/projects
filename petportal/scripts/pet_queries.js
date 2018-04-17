function q0a() {
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("results").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q0a.php?q=q0a",true);
    xmlhttp.send();
}

function q0b(str) {
    console.log(str);
    if (str == "0") {
        document.getElementById("queries").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("queries").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q0b.php?q="+str,true);
        xmlhttp.send();
    }
}

function q1a() {
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("results").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q1a.php?q=q",true);
    xmlhttp.send();
}

function q1b(str) {
    if (str == "0") {
        document.getElementById("queries").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("queries").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q1b.php?q="+str,true);
        xmlhttp.send();
    }
}

function q2a() {
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("rightbar").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q2a.php?q=q",true);
    xmlhttp.send();
}

function q2b() {
    var str = document.getElementById('q2txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q2b.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q3a(str) {
    if (str == "") {
        document.getElementById("rightbar").innerHTML = "";
        return;
    } else {
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("rightbar").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q3a.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q3b() {
    var str = document.getElementById('q3txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        q3a(str);
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q3b.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q4a(str) {
    if (str == "") {
        document.getElementById("rightbar").innerHTML = "";
        return;
    } else {
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("rightbar").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q4a.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q4b() {
    var str = document.getElementById('q4txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        q4a(str);
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q4b.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q5a() {
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("rightbar").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q5a.php?q=q5a",true);
    xmlhttp.send();
}

function q5b() {
    var str = document.getElementById('q5txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q5b.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q6a() {
    document.getElementById("rightbar").innerHTML = "";
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("rightbar").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q6a.php?q=q6a",true);
    xmlhttp.send();
}

function q6b() {
    var str = document.getElementById('q6txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q6b.php?q="+str,true);
        xmlhttp.send();
    } 
}

function q7a() {
    document.getElementById("rightbar").innerHTML = "";
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("rightbar").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q7a.php?q=q7a",true);
    xmlhttp.send();
}

function q7b() {
    document.getElementById("results").innerHTML = "";
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("results").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q7b.php?q=q7b",true);
    xmlhttp.send();
}

function q8a(str) {
    document.getElementById("rightbar").innerHTML = "";
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("rightbar").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET","php/q8a.php?q="+str,true);
    xmlhttp.send();
}

function q8b() {
    var str = document.getElementById('q8txt').value;
    console.log(str);
    if (str == "") {
        document.getElementById("results").innerHTML = "";
        return;
    } else { 
        q8a(str);
        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("results").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","php/q8b.php?q="+str,true);
        xmlhttp.send();
    } 
}