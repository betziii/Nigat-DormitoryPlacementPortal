let students = [
  
]


var openRequest = indexedDB.open("test", 3);

openRequest.onupgradeneeded = function (e) {
    console.log("running onupgradeneeded");
    var thisDB = e.target.result;

   
    if (!thisDB.objectStoreNames.contains("secondOS")) {
        thisDB.createObjectStore("firstOS", { autoIncrement:true });
    }
}


openRequest.onsuccess = function (e) {
    console.log("Success!");
    
    db = e.target.result;
    console.log(e.target)
    finalAssign();
    
    // document.querySelector("assignButton").addEventListener("click", finalAssign, false);
    // document.addEventListener('DOMContentLoaded',finalAssign());
    
}
openRequest.onerror = function (e) {
    console.log("Error");
    console.dir(e);
}


function finalAssign(e){
  var transaction = db.transaction(["firstOS"], "readwrite");
  var stud = transaction.objectStore("firstOS");
  var request = stud.getAll();

  request.onerror = function(event) {
    // Handle errors!
    console.log('error fetching data');
  };
  request.onsuccess = function(event) {
    // Do something with the request.result!
    // console.log(request.result)
    students.push(request.result)
    console.log(students)
  };
}






let fkilo = 4; //Number of available dorm spaces in 5-kilo
let skilo = 20; // Number of available dorm spaces in 6-kilo
let fbe = 10; //Number of available dorm spaces in fbe
let fkilopd = 2; //Number of students assigned per dorm at 5-kilo
let skilopd = 2; //Number of students assigned per dorm at 6-kilo
let fbepd = 2; //Number of students assigned per dorm at fbe

function compareNandD(a, b) {
    if (a.Year === b.Year) {
      return b.department - a.department;
    }
    return a.Year > b.Year ? 1 : -1;
  }

  function compareNames(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  
  //function to sort students  based on their department
  function compareDepartment(a, b) {
    if (a.department < b.department) {
      return -1;
    }
    if (a.department > b.department) {
      return 1;
    }
    return 0;
  }

  //function to clone an Array
function cloneArray(oArray, cArray) {
    cArray = [];
    cArray = oArray.map((a) => Object.assign({}, a));
    return cArray;
  }

students.sort(compareNames); //sort the student list alphabetically

// Filter out students who are 5th year to be assigned to 5-kilo
var fkilo_students = [];
var rStudents = []; //remaining students who haven't been assigned yet
for (var i = 0; i < students.length; i++) {
  if (students[i].Year == 5 && fkilo_students.length < fkilo) {
    fkilo_students.push(students[i]);
  } else {
    rStudents.push(students[i]);
  }
}

students = cloneArray(rStudents, students);
students.sort(compareNames);
rStudents = []

// Check if there are spaces left in 5-kilo after 5th years have been assigned
if (fkilo - fkilo_students.length > 0) {
    let spacesLeft = fkilo - fkilo_students.length;
    for (var i = 0; i < students.length; i++) {
      if (spacesLeft > 0) {
        if (students[i].Year == 4) {
          fkilo_students.push(students[i]);
          spacesLeft--;
        } else {
          rStudents.push(students[i]);
        }
      } else {
        rStudents.push(students[i]);
      }
    }
  }

  let mStudents = [];
let fStudents = [];
students = cloneArray(rStudents, students);

//list out female and male students who aren't assigned yet
for (var i = 0; i < students.length; i++) {
  if (students[i].sex == "M") {
    mStudents.push(students[i]); //male students assigned to 6-kilo
  } else {
    fStudents.push(students[i]); //female students assigned to FBE
  }
}

mStudents.sort(compareNandD); // to be assigned at 6-kilo
fStudents.sort(compareNandD); // to be assigned at fbe
console.log(mStudents);
console.log(fStudents);
console.log(fkilo_students); // 5th year students assigned to 5-kilo dormitory

//assign each students to dorms in 5-kilo
fiveKiloStudents = assign(fkilo_students, fkilopd);
fbeStudents = assign(fStudents, fbepd);
sixKiloStudents = assign(mStudents, skilopd);

console.log(fiveKiloStudents);
console.log(fbeStudents);
console.log(sixKiloStudents);

//function to assign each student to their dorms
function assign(list, pd) {
    let newArray = [];
    while (list.length) newArray.push(list.splice(0, pd));
    return newArray;
  }

  console.log(students);

  //function to display assigned rooms for each student
function display(array, campusName) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        console.log(
          array[i][j].name +
            " has been assigned to dorm number " +
            (parseInt(i) + 1) +
            " at " +
            campusName
        );
      }
    }
  }
  
  display(fiveKiloStudents, "5-kilo campus");
  display(fbeStudents, "FBE campus");
  display(sixKiloStudents, "6-kilo campus");



  // const accept_btn=document.querySelector('#accept');
  
  // accept_btn.addEventListener('click', assign)