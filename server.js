const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const ADMIN = {
    userid: "admin",
    password: "123"
};
function getStudents() {
    return JSON.parse(
        fs.readFileSync("students.json", "utf8")
    );
}
function saveStudents(data) {
    fs.writeFileSync(
        "students.json",
        JSON.stringify(data, null, 2)
    );
}
app.post("/login", (req, res) => {
    const { userid, password, course } = req.body;
    if (
        userid === ADMIN.userid &&
        password === ADMIN.password
    ) {
        return res.json({
            success: true,
            role: "admin"
        });
    }
    let students = getStudents();
    let student = students.find(
        s =>
            s.userid === userid &&
            s.password === password &&
            s.course === course
    );
    if (student) {
        return res.json({
            success: true,
            role: "student",
            student
        });
    }
    res.json({
        success: false
    });
});
app.get("/students", (req, res) => {
    res.json(getStudents());
});
app.post("/students", (req, res) => {
    let students = getStudents();
    students.push(req.body);
    saveStudents(students);
    res.json({
        message: "Student Added"
    });
});
app.put("/students/:id", (req, res) => {
    let students = getStudents();
    students[req.params.id] = req.body;
    saveStudents(students);
    res.json({
        message: "Updated"
    });
});
app.delete("/students/:id", (req, res) => {

    let students = getStudents();

    students.splice(req.params.id, 1);

    saveStudents(students);

    res.json({
        message: "Deleted"
    });
});

app.listen(3000, () => {
    console.log("Server Running");
});
