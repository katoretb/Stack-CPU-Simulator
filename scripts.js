
const themeToggleButton = document.getElementById('theme-toggle');

let pc = 0;
let bit = 8;
let sysF = {
    Memo: [],
    DataStack: [],
    ReturnStack: []
}
let halt = false


function pointNext(n){
    document.getElementById("pc" + pc).innerHTML = "&nbsp;";
    pc = (parseInt(pc) + 1) % n;
    document.getElementById("pc" + pc).innerHTML = "<i class='bi bi-arrow-right'></i>";
}

function pointTo(n, adr){
    document.getElementById("pc" + pc).innerHTML = "&nbsp;";
    pc = adr % n;
    document.getElementById("pc" + pc).innerHTML = "<i class='bi bi-arrow-right'></i>";
}


function Step(){
    const Nrows = parseInt(sysF.Memo.length)

    var ir = document.getElementById("mem" + pc).value;
    var operand = "";

    pointNext(Nrows)

    if (["IF", "CALL", "LIT"].includes(ir)) { // IF, CALL, LIT
        operand = document.getElementById("mem" + pc).value.slice(2, bit/4 + 2);
        pointNext(Nrows)
    }

    console.log(ir)

    switch(ir) {
        case 'LIT':
            sysF.DataStack.push(parseInt(operand, 16).toString(16).toUpperCase())
            LoadDS()
            break;
        case 'LOAD (@)':
            addr = parseInt(sysF.DataStack.pop(), 16)
            mem = sysF.Memo[addr].value.slice(2, bit/4 + 2)
            sysF.DataStack.push(mem)
            LoadDS()
            break;
        case 'Store (!)':
            addr = parseInt(sysF.DataStack.pop(), 16)
            sysF.Memo[addr] = parseInt(sysF.DataStack.pop(), 16).toString(16).toUpperCase()
            LoadM()
            LoadDS()
            break;
        case 'DROP':
            sysF.DataStack.pop()
            LoadDS()
            break;
        case 'DUP':
            sysF.DataStack.push(sysF.DataStack[sysF.DataStack.length-1])
            LoadDS()
            break;
        case 'OVER':
            sysF.DataStack.push(sysF.DataStack[sysF.DataStack.length-2])
            LoadDS()
            break;
        case 'SWAP':
            tmp1 = sysF.DataStack.pop()
            tmp2 = sysF.DataStack.pop()
            sysF.DataStack.push(tmp1)
            sysF.DataStack.push(tmp2)
            LoadDS()
            break;
        case 'ADD (+)':
            tmp2 = parseInt(sysF.DataStack.pop(), 16)
            tmp1 = parseInt(sysF.DataStack.pop(), 16)
            tmp = ((tmp1 + tmp2) & 0xff).toString(16).toUpperCase();
            sysF.DataStack.push(tmp)
            LoadDS()
            break;
        case 'SUB (-)':
            tmp2 = parseInt(sysF.DataStack.pop(), 16)
            tmp1 = parseInt(sysF.DataStack.pop(), 16)
            tmp = ((tmp1 + ~tmp2 + 1) & 0xff).toString(16).toUpperCase();
            sysF.DataStack.push(tmp)
            LoadDS()
            break;
        case 'AND':
            tmp2 = parseInt(sysF.DataStack.pop(), 16)
            tmp1 = parseInt(sysF.DataStack.pop(), 16)
            tmp = ((tmp1 & tmp2) & 0xff).toString(16).toUpperCase();
            sysF.DataStack.push(tmp)
            LoadDS()
            break;
        case 'OR':
            tmp2 = parseInt(sysF.DataStack.pop(), 16)
            tmp1 = parseInt(sysF.DataStack.pop(), 16)
            tmp = ((tmp1 | tmp2) & 0xff).toString(16).toUpperCase();
            sysF.DataStack.push(tmp)
            LoadDS()
            break;
        case 'XOR':
            tmp2 = parseInt(sysF.DataStack.pop(), 16)
            tmp1 = parseInt(sysF.DataStack.pop(), 16)
            tmp = ((tmp1 ^ tmp2) & 0xff).toString(16).toUpperCase();
            sysF.DataStack.push(tmp)
            LoadDS()
            break;
        case 'IF':
            tmp = sysF.DataStack.pop()
            if(tmp == 0)
                pointTo(Nrows, parseInt(operand, 16))
            LoadDS()
            break;
        case 'CALL':
            sysF.ReturnStack.push(pc.toString(16).toUpperCase())
            pointTo(Nrows, parseInt(operand, 16))
            LoadDS()
            LoadRS()
            break;
        case 'EXIT':
            pc = parseInt(sysF.ReturnStack.pop(), 16)
            LoadRS()
            break;
        case 'HALT':
            Swal.fire({
                title: "Finish",
                icon: "success"
            })
            Stop()
            break;
        case '>R':
            sysF.ReturnStack.push(sysF.DataStack.pop())
            LoadDS()
            LoadRS()
            break;
        case 'R>':
            sysF.DataStack.push(sysF.ReturnStack.pop())
            LoadDS()
            LoadRS()
            break;
        default:
            tmp = (pc - 1).toString(16).toUpperCase();
            halt = true;
            Stop();
            Swal.fire({
                text: "Operation not found at address " + tmp.padStart(bit/4, '0'),
                icon: "error"
            })
    }
}

function Stop() {
    halt = true;
    LoadM()
    document.getElementById("runbut").disabled = false;
    document.getElementById("stpbut").disabled = false;
    document.getElementById("rstbut").disabled = false;
    document.getElementById("clrbut").disabled = false;
}

function Run() {
    halt = false;
    document.getElementById("runbut").disabled = true;
    document.getElementById("stpbut").disabled = true;
    document.getElementById("rstbut").disabled = true;
    document.getElementById("clrbut").disabled = true;
    function executeNextStep() {
        try {
            if (!halt) {
                Step();
                requestAnimationFrame(executeNextStep);
            }
        } catch (error) {
            Stop();
            Swal.fire({
                text: "Error occurred : please check your code",
                icon: "error"
            })
        }
    }
    executeNextStep();
}

// Function to apply theme based on stored preference
function applyTheme() {
    const darkTheme = localStorage.getItem('dark-theme') === 'true';
    if (darkTheme) {
        document.body.classList.add('bg-dark', 'text-light');
        document.querySelectorAll("input").forEach((e) => e.classList.add('bg-dark', 'text-light'));
        document.querySelectorAll("table").forEach((e) => {
            e.classList.add("table-dark")
        })
        document.querySelectorAll("[id='tablehead']").forEach((e) => {
            e.style.backgroundColor = "rgb(13, 13, 13)"
        })
        themeToggleButton.querySelector('i').classList.replace('bi-brightness-high-fill', 'bi-moon-fill');
    } else {
        document.body.classList.remove('bg-dark', 'text-light');
        document.querySelectorAll("input").forEach((e) => e.classList.remove('bg-dark', 'text-light'));
        document.querySelectorAll("table").forEach((e) => {
            e.classList.remove("table-dark")
        })
        document.querySelectorAll("[id='tablehead']").forEach((e) => {
            e.style.backgroundColor = "rgb(218, 218, 218)"
        })
        themeToggleButton.querySelector('i').classList.replace('bi-moon-fill', 'bi-brightness-high-fill');
    }
}

// Set up theme toggle functionality
themeToggleButton.addEventListener('click', () => {
    const darkTheme = localStorage.getItem('dark-theme') === 'true'
    localStorage.setItem('dark-theme', !darkTheme);
    applyTheme()
});


function navbarButtonActive() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bt = urlParams.get("bits")
    const page = urlParams.get("page")
    if(!bt && page != "Docs") {
        window.location = "?bits=8"
    } else {
        if(page == "Docs"){
            document.getElementById("doc").classList.add("active")
            document.getElementById("sim").style.display = "none";
            document.getElementById("docp").style.display = "block";
            return
        }else{
            document.getElementById("sim").style.display = "block";
            document.getElementById("docp").style.display = "none";
        }
        if(bt == 8){
            document.getElementById("but8").classList.add("active")
            return
        }
        if(bt == 16){
            document.getElementById("but16").classList.add("active")
            bit = 16
            return
        }
        window.location = "?bits=8"
    }
}


function LoadDS(){
    let tmp = ""
    sysF.DataStack.findLast((e) => {tmp += `<tr><td>${e}</td></tr>`})
    document.getElementById("dst").innerHTML = tmp
}

function LoadRS(){
    let tmp = ""
    sysF.ReturnStack.findLast((e) => {tmp += `<tr><td>${e}</td></tr>`})
    document.getElementById("rst").innerHTML = tmp
}

function LoadM(){
    const darkTheme = localStorage.getItem('dark-theme') === 'true';
    let tmp = ""
    let i = 0
    sysF.Memo.forEach((e) => {
        tmp += `<tr><td id="pc${i}">${i == pc ? ("<i class='bi bi-arrow-right'></i>") : ("")}</td><td>0x${i.toString(bit).padStart(bit/4, '0').toUpperCase()}</td><td><input id="mem${i}" onkeydown="inkeydown(${i})" class="form-control ${darkTheme ? ('bg-dark text-light') : ('')}" list="suggestions" value="${e}"></td></tr>`    
        i++
    })
    tmp += `<tr><td></td><td>0x${i.toString(bit).padStart(bit/4, '0').toUpperCase()}</td><td><input id="tpmem" class="form-control ${darkTheme ? ('bg-dark text-light') : ('')}" list="suggestions"></td></tr>`
    document.getElementById("mem").innerHTML = tmp
    document.getElementById("tpmem").focus()

    document.getElementById('tpmem').addEventListener('keydown', function(e) {
        const input = e.target;
        const list = input.getAttribute('list');
        const options = document.getElementById(list).options;
        
        if (e.key === 'Tab' && input.value) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].value.toLowerCase().startsWith(input.value.toLowerCase())) {
                    input.value = options[i].value;
                    break;
                }
            }
            e.preventDefault(); // prevents moving to the next field if a match is found
        }
    
        if (e.key === 'Enter'){
            const options2 = Array.from(document.querySelectorAll('#suggestions option')).map(option => option.value);
            if(options2.includes(e.target.value)){
                sysF.Memo.push(document.getElementById("tpmem").value)
                LoadM()
            }
        }
    });
}

function LoadSug(){
    const opcodes = [
        'LIT', 'LOAD (@)', 'Store (!)', 'DROP', 'DUP', 'OVER', 'SWAP', 'ADD (+)', 'SUB (-)', 'AND', 'OR', 'XOR', 'IF', 'CALL', 'EXIT', 'HALT', '>R', 'R>'
    ];

    let options = opcodes.map((op, i) => `<option value="${op}">`).join('\n');

    for (let i = -32; i <= -1; i++) {
        let hexValue = ((bit/4 == 2) ? (0x100) : (0x10000) + i).toString(16).toUpperCase();
        options += `<option value="0x${hexValue} (${i})">`;
    }

    for (let i = 0; i < 128; i++) {
        let value = i.toString(16).padStart(bit/4, '0').toUpperCase();
        options += `<option value="0x${value} (${i})">`;
    }

    const masks = ['80', '0F', 'F0', 'FF'];
    options += masks.map(mask => `<option value="0x${mask} (mask)">`).join('');

    document.getElementById("suggestions").innerHTML = options
}

function LoadAll(){
    LoadDS()
    LoadRS()
    LoadM()
    LoadSug()
}

async function resetall(){
    Swal.fire({
        text: 'Are you sure to Reset and clear',
        icon: "warning",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: `Clear`,
          confirmButtonColor: "rgb(217, 39, 39)",
    }).then(async ok => {
        if(ok.isConfirmed){
            sysF = {
                Memo: [],
                DataStack: [],
                ReturnStack: []
            }
            LoadAll()         
        }
    })
}

function reset(){
    pc = 0
    sysF.DataStack = []
    sysF.ReturnStack = []
    LoadAll()
}

function inkeydown(i) {
    const input = document.getElementById(`mem${i}`);
    const list = input.getAttribute('list');
    const options = document.getElementById(list).options;
    
    if (event.key === 'Tab' && input.value) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toLowerCase().startsWith(input.value.toLowerCase())) {
                input.value = options[i].value;
                break;
            }
        }
        event.preventDefault();
    }

    if (event.key === 'Enter'){
        const options2 = Array.from(document.querySelectorAll('#suggestions option')).map(option => option.value);
        if(options2.includes(input.value)){
            sysF.Memo[i] = input.value
            LoadM()
        }
    }
};


function saveMemoryOptionsToFile() {
    const fileData = JSON.stringify(sysF);

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
    element.setAttribute('download', 'SCPUS.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

const loadFromFileButton = document.getElementById("load-from-file-button");
const fileInput = document.getElementById("file-input");
loadFromFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => loadMemoryOptionsFromFile(fileInput.files[0]));

function loadMemoryOptionsFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const fileData = e.target.result;
        sysF = JSON.parse(fileData);
        // validate Mem
        sysF.Memo.forEach((e, i) => {
            if(e.startsWith("0x")){
                let tmp = parseInt(e.slice(2, e.indexOf("")-1), 16)
                sysF.Memo[i] = `0x${tmp.toString(16).padStart(bit/4, '0').toUpperCase()} (${tmp})`
            }
        })
        LoadAll()
    };

    

    reader.readAsText(file);
}


// Apply the theme on page load
applyTheme();
navbarButtonActive();
LoadAll()