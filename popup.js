// Initialize butotn with users's prefered color
let generate = document.getElementById("generateSchedule");
let miniCourses = document.getElementById("miniCourses");
const optionsButton = document.getElementById("openOptionsPage")

chrome.storage.sync.get("courses", ({ courses }) => {

  let counts = {}
  courses.forEach( function(co) {
    counts[co.asig] = (counts[co.asig] || 0) + 1
  })

  counts = Object.entries(counts)

  courses.forEach(count => { 

    let newCourse = document.createElement("div");
    newCourse.classList.add("course-card");
    let timeletters = count.courseTime2.join(" ")
    newCourse.innerHTML = `
      <span>${timeletters}</span>
        
        <div>
          <h3>${count.courseTitle}</h3>
          <span class="italic teacher">${count.courseTeacher}</span>
        </div>
        
        <div class="data">
          <span>${count.courseNRC}</span>
          <span>${count.courseCredits} cred</span>
      </div>`

    miniCourses.appendChild(newCourse);
  });

  // console.log(selected)
});

// When the button is clicked, inject setPageBackgroundColor into current page
generate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: changeDOM,
  });
});

optionsButton.addEventListener("click", openOptions)

// The body of this function will be execuetd as a content script inside the
// current page
function changeDOM() {
  chrome.storage.sync.get("courses", ({ courses }) => {

    let nrcs = document.querySelectorAll(".course-nrc");
    let titles = document.querySelectorAll(".course-title");
    let credits = document.querySelectorAll(".course-credits");
    let schedules = document.querySelectorAll(".course-schedule");
    let times = document.querySelectorAll(".course-schedule .time");

    let newCourse = {
      courseTitle: allInputs[0].value,
      courseTeacher: allInputs[1].value,
      courseNRC: allInputs[2].value,
      courseCredits: allInputs[3].value,  
      courseDays: [],
      courseTime: [],
      courseTime2: [],
      courseShow: true,
    }
   
    for (let i = 0; i < 2; i++) {
      let foundCourse = {
        "nrc": nrcs[i].innerText,
        "asig": titles[i].innerText,
        "credit": credits[i].innerText,
        "days": Array.from(schedules[i].querySelectorAll(".schedule-active")).map(x => x.innerText),
        "time": times[i].innerText
      }

      courses.push(foundCourse)
    }

    console.log(courses);

    chrome.storage.sync.set({ courses });

  });
}


function openOptions () {
  chrome.runtime.openOptionsPage()
}
