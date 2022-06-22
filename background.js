let courses = [{
  "courseTitle": "Laboratorio de Innovación",
  "courseTeacher": "Ponce Calderon, Anghely Mabel",
  "courseNRC": 24708,
  "courseCredits": 1,  
  "courseDays": [['wednesday']],
  "courseTime": [[130, 90]],
  "courseTime2": ["09:10 - 10:40"],
  "courseShow": true,
}, 
{
  "courseTitle": "Álgebra Matricial",
  "courseTeacher": "Navarro Veliz, Jose Alejandro",
  "courseNRC": 20621,
  "courseCredits": 4,  
  "courseDays": [["monday"], ["tuesday"]],
  "courseTime": [[30, 190], [30, 90]],
  "courseTime2": ["07:30 - 10:40", "07:30 - 09:00"],
  "courseShow": false,
}
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ courses });
  let courseList = courses.map( course => course.courseTitle).join(", ")
  console.log(`Tus cursos son los siguientes: ${courseList}`);
});
