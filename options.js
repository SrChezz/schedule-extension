
const scheduleContainer = document.querySelectorAll(".schedule-content")
const listContainer = document.querySelector(".list-container")

const addCourseButton = document.getElementById("addCourseButton");
const addCourseButtonPlus = document.querySelector("#addCourseButton .icon")

const myForm = document.querySelector("#addCourseButton .hide-form")
const buttonsContainer = document.querySelector("#addCourseButton .hide-form .fieldset:last-child")
const addTime = document.getElementById("addTime");
const saveCourse = document.getElementById("saveCourse")

let allInputs = document.querySelectorAll("#addCourseButton .hide-form input")

addCourseButtonPlus.addEventListener("click", showForm)
addTime.addEventListener("click", addTimeFunction)
saveCourse.addEventListener("click", saveCourseFunction)


function showForm () {
    addCourseButton.classList.toggle("active")
}

function addTimeFunction () {
    newTimeDiv = document.createElement("div")
    newTimeDiv.innerHTML = `
        <input type="time" id="time1" name="time1"  min="07:00" max="23:00" value="07:00" required>
        <input type="time" id="time2" name="time2" min="07:00" max="23:00" value="07:30" required>`

    newFieldset = document.createElement("fieldset")
    newFieldset.innerHTML = `
    <legend class="uppercase">Días de clase</legend>

        <input class="checked-day" type="checkbox" id="monday" name="monday" value="monday">
        <label for="days" class="uppercase">Lunes</label> <br>

        <input class="checked-day" type="checkbox" id="tuesday" name="tuesday" value="tuesday">
        <label for="tuesday" class="uppercase">Martes</label><br>

        <input class="checked-day" type="checkbox" id="wednesday" name="wednesday" value="wednesday">
        <label for="wednesday" class="uppercase">Miercoles</label><br>

        <input class="checked-day" type="checkbox" id="thursday" name="thursday" value="thursday">
        <label for="thursday" class="uppercase">Jueves</label><br>

        <input class="checked-day" type="checkbox" id="friday" name="friday" value="friday">
        <label for="friday" class="uppercase">Viernes</label><br>
        
        <input class="checked-day" type="checkbox" id="saturday" name="saturday" value="saturday">
        <label for="saturday" class="uppercase">Sabado</label><br>
    </fieldset>
    `

    myForm.insertBefore(newTimeDiv, myForm.children[myForm.children.length - 1]);
    myForm.insertBefore(newFieldset, myForm.children[myForm.children.length - 1]);

    addTime.classList.add("hide")
    allInputs = document.querySelectorAll("#addCourseButton .hide-form input")
}

function saveCourseFunction () {

    
    // if allInputs[0].value.length !== 0

    chrome.storage.sync.get("courses", ({ courses }) => {

    let days1 = []
    let days2 = []

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


    if (allInputs.length > 0) {
        for (let i = 6; i <= 11; i++) {
            if (allInputs[i].checked) {
                days1.push(allInputs[i].value)         
            } 
        }
        newCourse.courseDays.push(days1)   
        newCourse.courseTime.push(getTimeInterval(allInputs[4].value, allInputs[5].value))
        newCourse.courseTime2.push(`${allInputs[4].value} - ${allInputs[5].value}`)
    }

    if (allInputs.length > 14) {
        for (let i = 14; i <= 20; i++) {
            if (allInputs[i].checked) {
                days2.push(allInputs[i].value)         
            }           
        }
        newCourse.courseDays.push(days2) 
        newCourse.courseTime.push(getTimeInterval(allInputs[12].value, allInputs[13].value))
        newCourse.courseTime2.push(`${allInputs[12].value} - ${allInputs[13].value}`) 
    } 
    

    // newCourse.courseDays = [days1, days2]
    // newCourse.courseTime = [time1, time2]

    // console.table(JSON.stringify(newCourse))
    /* console.log(newCourse.courseTime) */

    function getTimeInterval(time1, time2) {
        if(!time1 || !time2 ) {
            return []
        }
        minutes1 = parseInt(time1.split(':')[0]*60) + parseInt(time1.split(':')[1])
        minutes2 = parseInt(time2.split(':')[0]*60) + parseInt(time2.split(':')[1])
        courseInterval = minutes2 - minutes1

        /* console.log(minutes1)
        console.log(minutes2)
        console.log(courseInterval)
        console.log(time2.split(':')[0]) */

        return [minutes1-420, courseInterval]
    }
    
        if (allInputs[0].value.length !== 0 && allInputs[1].value.length !== 0  && allInputs[2].value.length !== 0  && allInputs[3].value.length !== 0  && newCourse.courseDays.length !== 0  && !newCourse.courseTime.length !== 0) {

            let repeatedCourse = courses.find(filteredCourse => {
                return filteredCourse.courseNRC == newCourse.courseNRC
            })
            
            if (!repeatedCourse) {
                courses.push(newCourse)
                chrome.storage.sync.set({ courses })
                renderCourse(newCourse)
            } else {
                console.log("Parece que este curso ya existe")
            }
        } else {
            console.log("oopsie doopsie")
        }

        resetForm()

    })
}

function resetForm() {
    allInputs[0].value = ""
    allInputs[1].value = ""
    allInputs[2].value = ""
    allInputs[3].value = ""
    allInputs[4].value = "07:00"
    allInputs[5].value = "07:30"

    if (allInputs.length > 0) {
        for (let i = 6; i <= 11; i++) {
            if (allInputs[i].checked) {
                allInputs[i].checked = false     
            } 
        }

    }

    if (allInputs.length > 14) {
        allInputs[12].value = "07:00"
        allInputs[13].value = "07:30"
        for (let i = 14; i <= 20; i++) {
            if (allInputs[i].checked) {
                allInputs[i].checked = false      
            }           
        }
    } 

    showForm()
}

function renderAllCourses() {
    chrome.storage.sync.get("courses", ({ courses }) => {

        /* console.log(courses) */

        

        courses.forEach(course => {

            
            renderCourse(course)
            
            

        }) 
    })
}

function renderCourse(course) {

    let colors = [ ["--color-blue", "--color-lightblue"],
                ["--color-red", "--color-lightred"],
                ["--color-purple", "--color-lightpurple"],
                ["--color-golden", "--color-lightgolden"]]

    const random = colors[Math.floor(Math.random() * colors.length)];

    //Adding course to schedule container
    renderCourseSchedule(course, random)

    //Adding course to list container
    let test = course.courseTime2.join(" ")

    let newListCourse = document.createElement("div")
    newListCourse.classList.add("list-course-card")
    newListCourse.style.backgroundColor = `var(${random[1]})`

    let eyeSymbol
    if (course.courseShow) {
        eyeSymbol = ""
    } else {
        eyeSymbol = ""
    }

    newListCourse.innerHTML = `

        <div class="more">
            <i class="icona toggle-more" data-icon=""></i>
            <i class="toggle-content toggle-content-see" data-nrc="${course.courseNRC}">${eyeSymbol}</i>
            <i class="toggle-content toggle-content-delete" data-nrc="${course.courseNRC}"></i>
        </div>

        <span class="uppercase center">${test}</span>
        
        <div>
            <h3>${course.courseTitle}</h3>
            <span class="italic teacher">${course.courseTeacher}</span>
        </div>
        
        <div class="data">
            <span class="uppercase">${course.courseNRC}</span>
            <span class="uppercase">${course.courseCredits} Cred</span>
        </div>`

    listContainer.appendChild(newListCourse)
    findToggles ()

}

renderAllCourses()

function renderCourseSchedule(course, random) {

        for (let i = 0; i < course.courseTime.length; i++) {

            
    
            let newScheduleCourse = document.createElement("div")
            newScheduleCourse.classList.add("nrc"+course.courseNRC)
            if (course.courseShow == false) {
                newScheduleCourse.style.opacity = "0"
            }
            newScheduleCourse.innerHTML = `
            <div >
    
                <span class="uppercase center">${course.courseTime2[i]}</span>
                <div>
                <h3>${course.courseTitle}</h3>
                <span class="italic teacher">${course.courseTeacher}</span>
                </div>
                <div class="data">
                <span class="uppercase">${course.courseNRC}</span>
                <span class="uppercase">${course.courseCredits} Cred</span>
                </div>
    
            </div>`
    
            let top = getPercentage(course.courseTime[i][0])
            let height = getPercentage(course.courseTime[i][1])
    
            newScheduleCourse.style.top = top
            newScheduleCourse.style.height = height
    
            // console.log(`${i} Timing ` + top + " " +  height)
    
            newScheduleCourse.style.color = `var(${random[0]})`
            newScheduleCourse.style.backgroundColor = `var(${random[1]})`
            newScheduleCourse.style.borderColor = `var(${random[0]})`
    
            /* console.log(`var(${random[0]})`) */   
    
            course.courseDays[i].forEach(day => {
    
                if (day == "monday") {
                    scheduleContainer[0].appendChild(newScheduleCourse.cloneNode(true))
                }
                if (day == "tuesday") {
                    scheduleContainer[1].appendChild(newScheduleCourse.cloneNode(true))
                }
                if (day == "wednesday") {
                    scheduleContainer[2].appendChild(newScheduleCourse.cloneNode(true))
                }
                if (day == "thursday") {
                    scheduleContainer[3].appendChild(newScheduleCourse.cloneNode(true))
                }
                if (day == "friday") {
                    scheduleContainer[4].appendChild(newScheduleCourse.cloneNode(true))
                }
                if (day == "saturday") {
                    scheduleContainer[5].appendChild(newScheduleCourse.cloneNode(true))
                }              
    
            });
    
            function getPercentage(number) {
                // The number of all minutes from 7:00 to 23:00 is 960        
    
                let answer = Math.round(((100 * number)/960) * 100)/100
                return answer + "%"
            }
            
        }
    
        // console.table(JSON.stringify(course))
    
}

function findToggles () {

    let toggleSee= document.querySelectorAll(".toggle-content-see")
    let toggleDelete= document.querySelectorAll(".toggle-content-delete")

    toggleSee.forEach(button => {
        button.addEventListener("click", hideCourse)
    });

    toggleDelete.forEach(button => {
        button.addEventListener("click", deleteCourse)
    });
}



function hideCourse() {

    chrome.storage.sync.get("courses", ({ courses }) => {

        let nrc = this.getAttribute("data-nrc")

        let index = courses.findIndex( function( course ) {
            return course.courseNRC == nrc;
        });

        
        let targetedCourse = document.querySelectorAll(".nrc"+nrc)
        // console.log(targetedCourse)

        // Eye can see, then lets remove its vision
        if (this.innerText == "") {
            this.innerText = ""


            targetedCourse.forEach(abc => {
                abc.style.opacity = "0"
            });
            

        // Eye can not see
        } else if (this.innerText == "") {
            this.innerText = ""

            targetedCourse.forEach(abc => {
                abc.style.opacity = "1"
            });
        }

        courses[index].courseShow ? courses[index].courseShow = false : courses[index].courseShow = true

        chrome.storage.sync.set({ courses })

    })
}

function deleteCourse () {
    // console.log("delete")

    chrome.storage.sync.get("courses", ({ courses }) => {

        let nrc = parseInt(this.getAttribute("data-nrc"))

        let listCourse = this.parentElement.parentElement
        listCourse.remove()
        
        let targetedCourse = document.querySelectorAll(".nrc"+nrc)
        targetedCourse.forEach(abc => {
            abc.remove()
        });

        courses = courses.filter( function( course ) {
            return course.courseNRC !== nrc;
        });

        chrome.storage.sync.set({ courses })
        console.log(courses)

    })
}
