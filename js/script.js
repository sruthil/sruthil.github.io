async function toggleFullScreen() {
      const btnText = document.getElementById('btnText');
      const btnIcon = document.getElementById('btnIcon');

      try {
        // If already in fullscreen, exit it
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        ) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { /* Safari */
            await document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { /* IE/Edge */
            await document.msExitFullscreen();
          }
        } 
        // Otherwise, request fullscreen for the entire document
        else {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            await docEl.requestFullscreen();
          } else if (docEl.webkitRequestFullscreen) { /* Safari */
            await docEl.webkitRequestFullscreen();
          } else if (docEl.msRequestFullscreen) { /* IE/Edge */
            await docEl.msRequestFullscreen();
          }
        }
      } catch (err) {
        console.error(`Error toggling fullscreen: ${err.message}`);
      }
    }

/**
 * Listen for fullscreen changes (e.g., if user presses ESC key)
 * to keep button state synchronized with browser state.
 */
function updateButtonState() {
  const btnText = document.getElementById('btnText');
  const isFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  if (isFullscreen) {
    btnText.textContent = 'Exit Fullscreen';
  } else {
    btnText.textContent = 'Enable Fullscreen';
  }
}

// Attach event listeners for cross-browser fullscreen change tracking
document.addEventListener('fullscreenchange', updateButtonState);
document.addEventListener('webkitfullscreenchange', updateButtonState);
document.addEventListener('msfullscreenchange', updateButtonState);

let teamA, teamB, Overs, Wickets;

let totalballs = 0;

document.getElementById("detailsForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }
    teamA = e.target.elements.teamA.value;
    teamB = e.target.elements.teamB.value;
    Overs = parseInt(e.target.elements.overs.value || "0", 10);
    Wickets = parseInt(e.target.elements.wickets.value || "0", 10);
    totalballs = Overs * 6;
    // console.log(teamA, teamB, Overs, Wickets);
    document.querySelector(".container").classList.add("active");

    document.querySelector(".coin .head").innerHTML = teamA;
    document.querySelector(".coin .tail").innerHTML = teamB;
});


const coin=document.querySelector(".coin")
const roll_button=document.querySelector("#coinToss")
const title=document.querySelector("h1.title")

const ctos = document.querySelector(".coin.on")
ctos.addEventListener("click", (e)=>{
    e.target.classList.remove("on")
    toss();
})

roll_button.addEventListener("click",toss)

let c = 0;

let firstInnings;
let tosswinner;

function toss()
{
    if(c == 0){
        c=1;
        roll_button.disabled=true
        title.innerHTML="Tossing..."
        rand=Math.floor(Math.random()*2+1)
        coin.classList.add("animate")
        setTimeout(function(){
            if(rand%2==0)
            {
                title.innerHTML=teamA + " won the toss";
                coin.style.transform="rotateX(45deg)";
                tosswinner = "A"
            }
            else
            {
                title.innerHTML=teamB + " won the toss";
                coin.style.transform="rotateX(135deg)";
                tosswinner = "B"
            }
            coin.classList.remove("animate")
            roll_button.disabled=false
            roll_button.classList.add("disabled");
            // roll_button.innerText = "Start Match"
            document.querySelector(".choice").classList.add("active");
        },1500);
    }
    else if(c == 2){
        document.querySelector(".container").classList.add("start");
        document.querySelector(".teamsnames .team.t1").innerHTML = teamA;
        document.querySelector(".teamsnames .team.t2").innerHTML = teamB;
        document.querySelector(".innings-news").innerText = (tosswinner == "A"? teamA : teamB) + " won the toss and choose to " + (firstInnings == tosswinner? "bat" : "bowl") + " first";
        
    }
}


document.querySelectorAll(".choice .choiceBtn").forEach(elem => {
    elem.addEventListener("click", (e)=>{
        c=2;
        roll_button.classList.remove("disabled");
        roll_button.innerText = "Start Match"
        document.querySelector(".choice").classList.remove("active");
        if(tosswinner == "A"){
            if(e.target.getAttribute("data-choice") == "bat")
                firstInnings = "A"
            else
                firstInnings = "B"
        }
        else{
            if(e.target.getAttribute("data-choice") == "bat")
                firstInnings = "B"
            else
                firstInnings = "A"
        }
        document.querySelector(".runwicketsection .countryName").innerText = (firstInnings == "A"? teamA : teamB);
    })
});

let totalballcount = 0;
let ballcount = 0;
let overcount = 0;
let runCount = 0;
let wktCount = 0;


function increaseBall() {
    document.querySelector(".runs .rn").innerText = runCount;
    // 1. Strictly less than to prevent exceeding max balls
    if (totalballcount < totalballs) {
        totalballcount++;
        
        // 2. Increment ballcount first, then reset at 6
        ballcount++;
        if (ballcount > 5) { // 6th ball completes the over
            ballcount = 0;
            overcount++;
            document.querySelector(".overCount").innerText = `${overcount}.${ballcount}`;
            // setTimeout(() => {
            //     document.querySelector(".bowlingover").innerHTML = ""
            // }, 3000);
        }
        
        return true; // 3. Must explicitly return true so 'if (increaseBall())' passes
    } else {
        return false;
    }
}

document.querySelectorAll(".bowlActionButton").forEach(e => {
    e.addEventListener("click", () => {
        if((totalballcount+1) == totalballs) inningsOver();
        if(ballcount == 0) document.querySelector(".bowlingover").innerHTML = "";
        const data_value = e.getAttribute("data-value");
        if (Number(data_value) > 0) { // Changed to >= 0 so dot balls (0 runs) work
            // Call increaseBall first to check if the match/innning is still active
            runCount += Number(data_value)
            if (increaseBall()) {
                document.querySelector(".bowlingover").innerHTML += `<div class="b-run">${data_value}</div>`;
                document.querySelector(".overCount").innerText = `${overcount}.${ballcount}`;
            } else {
                console.log("Innings complete / Max overs reached");
                inningsOver();
            }
        }
        else if (Number(data_value) == 0) {
            // Call increaseBall first to check if the match/innning is still active
            if (increaseBall()) {
                document.querySelector(".bowlingover").innerHTML += `<div class="b-dot">•</div>`;
                document.querySelector(".overCount").innerText = `${overcount}.${ballcount}`;
            } else {
                console.log("Innings complete / Max overs reached");
                inningsOver();
            }
        }
        else if (Number(data_value) == -1) {
            // Call increaseBall first to check if the match/innning is still active
            if (increaseBall()) {
                wktCount++;
                if(wktCount < Wickets){
                    document.querySelector(".runs .wk").innerText = wktCount;
                    document.querySelector(".bowlingover").innerHTML += `<div class="b-wkt">X</div>`;
                    document.querySelector(".overCount").innerText = `${overcount}.${ballcount}`;
                }
                else {
                    console.log("Innings complete / All Out");
                    inningsOver();
                }

            } else {
                console.log("Innings complete / Max overs reached");
                inningsOver();
            }
        }
        else if (Number(data_value) == -2) {
            runCount++
            document.querySelector(".bowlingover").innerHTML += `<div class="b-wid">W</div>`;
        }
        else if (Number(data_value) == -3) {
            runCount++
            document.querySelector(".bowlingover").innerHTML += `<div class="b-nob">N</div>`;
        }
        else if (Number(data_value) == -4) {
            document.querySelector(".bowlingover").innerHTML += `<div class="b-ded">D</div>`;
        }
        
        if(firstInningsRun > 0){
            if(runCount > firstInningsRun){
                console.log(1)
                document.body.innerHTML = `<div class='success-popup'>
                <h1>${(firstInnings == "A"? teamB : teamA)}</h1>
                <h2>has won the match 1</h2>
                <button type='button' onclick='location.reload(true);'>Start New Match</button>
                </div>`
                // alert((firstInnings == "A"? teamB : teamA) + " Won the match");
            }
        }
    });
});

let firstInningsRun = 0;

function inningsOver(){
    setTimeout(() => {
    if(firstInningsRun > 0){
        if(runCount > firstInningsRun){
            console.log(2)
            // document.body.innerHTML = "<div class='success-popup'"
            // alert((firstInnings == "A"? teamB : teamA) + " Won the match")
            document.body.innerHTML = `<div class='success-popup'>
                <h1>${(firstInnings == "A"? teamB : teamA)}</h1>
                <h2>has won the match 2</h2>
                <button type='button' onclick='location.reload(true);'>Start New Match</button>
                </div>`
        }
        // else{
        //     console.log(3)
        //     // document.body.innerHTML = "<div class='success-popup'"
        //     // alert((firstInnings == "B"? teamB : teamA) + " Won the match")
        //     document.body.innerHTML = `<div class='success-popup'>
        //         <h1>${(firstInnings == "B"? teamB : teamA)}</h1>
        //         <h2>has won the match 3</h2>
        //         <button type='button' onclick='location.reload(true);'>Start New Match</button>
        //         </div>`
        // }
    }
    else{
        alert("First Innings over")
    }
    firstInningsRun = runCount;
    document.querySelector(".innings-news").innerText = `Target: ${runCount + 1} from ${totalballs}`;
    totalballcount = 0;
    ballcount = 0;
    overcount = 0;
    runCount = 0;
    wktCount = 0;
    document.querySelector(".runs .rn").innerText = runCount;
    document.querySelector(".runs .wk").innerText = wktCount;
    document.querySelector(".bowlingover").innerHTML = "";
    document.querySelector(".overCount").innerText = `${overcount}.${ballcount}`;
    if(firstInnings == "A")
        document.querySelector(".countryName").innerText = teamB
    else
        document.querySelector(".countryName").innerText = teamA
    }, 500);
    
}