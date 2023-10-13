const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/StudentEnrollmentSystem')
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log(error)
})

const studentSchema = {
    id: Number,
    firstName: String,
    lastName: String,
    birth: String,
    gender: String,
    contact: Number,
    address: String,
    guardian: String
}

const courseSchema = {
    id: Number,
    courseName: String,
    courseCode: String,
    description: String,
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructor'
    },
    creditHours: String,
    maximumEnrollment: String,
    semester: String
}

const instructorSchema = {
    id: Number,
    firstName: String,
    lastName: String,
    contactInformation: String,
    department: String,
    officeHours: String
}

const enrollmentSchema = {
    id: Number,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    date: String,
    status: String
}

const gradeSchema = {
    id: Number,
    id: Number,
    grade: Number,
    exam: Number,
    finalGrade: Number,
    semester: String
}

const semesterSchema = {
    id: Number,
    semesterName: String,
    startDate: Number,
    endDate: Number,
    registrationDeadline: Number
}

const paymentSchema = {
    id: Number,
    paymentAmount: Number,
    paymentDate: Number,
    paymentMethod: String,
    paymentStatus: String
}

const notificationSchema = {
    id: Number,
    type: String,
    content: String,
    timestamp: String,
    status: String
}


const student = mongoose.model("student", studentSchema)
const course = mongoose.model("course", courseSchema)
const instructor = mongoose.model("instructor", instructorSchema)
const enrollment = mongoose.model("enrollment", enrollmentSchema)
const grade = mongoose.model("grade", gradeSchema)
const semester = mongoose.model("semester", semesterSchema)
const payment = mongoose.model("payment", paymentSchema)
const notification = mongoose.model("notification", notificationSchema)

app.get('/', async (req, res) => {
    try {
        const studentList = await student.find({});
        res.render("index", { details: studentList });
    } catch (err) {
        console.error(err);
        res.render("index", { details: null });
    }
});


app.post("/", async (req, res) => {
    console.log('posting...')
    const nextStudentId = await student.countDocuments({}) + 1001;

    try {
        let newStudent = new student({
            id: nextStudentId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birth: req.body.birth,
            gender: req.body.gender,
            contact: req.body.contact,
            address: req.body.address,
            guardian: req.body.guardian
        });

        await newStudent.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the student data." });
    }
})

app.delete("/delete/student/:studentId", async (req, res) => {
    const studentIdToDelete = req.params.studentId;

    try {
        const result = await student.findByIdAndDelete(studentIdToDelete);
        console.log("Deleted student:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/student/:studentId", async (req, res) => {
    console.log('updating...')
    const studentIdToUpdate = req.params.studentId;
    console.log('Here is thy tea master ', studentIdToUpdate)

    try {
        const updatedStudent = await student.findByIdAndUpdate(
            studentIdToUpdate,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birth: req.body.birth,
                gender: req.body.gender,
                contact: req.body.contact,
                address: req.body.address,
                guardian: req.body.guardian
            },
            { new: true }
        );
        
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }
        console.log("Updated:", updatedStudent);
        res.status(200).json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});


app.get('/course', async (req, res) => {
    try {

            const courseList = await course.find({})
            .populate('instructor') // Populate the instructor

        const instructors = await instructor.find({}); 
        
        res.render("course", { details: courseList, instructors });
        console.log(courseList)
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the course data." });
    }
});

app.post("/course", async (req, res) => {
    console.log('posting...')
    const nextCourseId = await course.countDocuments({}) + 1001;

    try {
        let newCourse = new course({
            id: nextCourseId,
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            description: req.body.description,
            instructor: req.body.instructor,
            creditHours: req.body.creditHours,
            maximumEnrollment: req.body.maximumEnrollment,
            semester: req.body.semester
        });

        await newCourse.save();
        res.redirect('/course');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the student data." });
    }
})

app.delete("/delete/course/:courseId", async (req, res) => {
    const courseIdToDelete = req.params.courseId;

    try {
        const result = await course.findByIdAndDelete(courseIdToDelete);
        console.log("Deleted course:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/course/:courseId", async (req, res) => {
    console.log('updating...')
    const courseIdToUpdate = req.params.courseId;
    console.log('Here is thy tea master ', courseIdToUpdate)

    try {
        const updatedCourse = await course.findByIdAndUpdate(
            courseIdToUpdate,
            {
                courseName: req.body.courseName,
                courseCode: req.body.courseCode,
                description: req.body.description,
                instructor: req.body.instructor,
                creditHours: req.body.creditHours,
                maximumEnrollment: req.body.maximumEnrollment,
                semester: req.body.semester
            },
            { new: true }
        );
        
        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        console.log("Updated:", updatedCourse);
        res.status(200).json(updatedCourse);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});


app.get("/instructor", async (req, res) => {
    try {
        const instructorList = await instructor.find({});
        res.render("instructor", { details: instructorList });
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the instructor data." });
    }
})

app.post("/instructor", async (req, res) => {
    console.log('posting...')
    const nextInstructorId = await instructor.countDocuments({}) + 1001;
    try {
        let newInstructor = new instructor({
            id: nextInstructorId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            contactInformation: req.body.contactInformation,
            department: req.body.department,
            officeHours: req.body.officeHours,
        });

        await newInstructor.save();
        res.redirect('/instructor');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the instructor data." });
    }
})

app.delete("/delete/instructor/:instructorId", async (req, res) => {
    const instructorIdToDelete = req.params.instructorId;

    try {
        const result = await instructor.findByIdAndDelete(instructorIdToDelete);
        console.log("Deleted instructor:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/instructor/:instructorId", async (req, res) => {
    console.log('updating...')
    const instructorIdToUpdate = req.params.instructorId;
    console.log('Here is thy tea master ', instructorIdToUpdate)

    try {
        const updatedInstructor = await instructor.findByIdAndUpdate(
            instructorIdToUpdate,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                contactInformation: req.body.contactInformation,
                department: req.body.department,
                officeHours: req.body.officeHours,
            },
            { new: true }
        );
        
        if (!updatedInstructor) {
            return res.status(404).json({ error: "Instructor not found" });
        }
        console.log("Updated:", updatedInstructor);
        res.status(200).json(updatedInstructor);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.get("/enrollment", async (req, res) => {
    try {
        const enrollmentList = await enrollment.find({})
            .populate('student') // Populate the student field
            .populate('course'); // Populate the course field
        
        // Add code to retrieve the list of students and courses here
        const students = await student.find({}); // Replace this with the actual code to fetch students
        const courses = await course.find({}); // Replace this with the actual code to fetch courses
        
        res.render("enrollment", { details: enrollmentList, students, courses });
        console.log(enrollmentList)
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the enrollment data." });
    }
})

app.post("/enrollment", async (req, res) => {
    console.log('posting...')
    const nextEnrollmentId = await enrollment.countDocuments({}) + 1001;

    try {
        const selectedStudentId = req.body.student;
        const selectedCourseId = req.body.course;

        // Fetch the selected student and course from the database based on their IDs
        const selectedStudent = await student.findById(selectedStudentId);
        const selectedCourse = await course.findById(selectedCourseId);

        if (!selectedStudent || !selectedCourse) {
            // Handle the case where the selected student or course is not found
            return res.render("error", { errorMessage: "Selected student or course not found." });
        }

        let newEnrollment = new enrollment({
            id: nextEnrollmentId,
            date: req.body.date,
            status: req.body.status,
            student: selectedStudent, // Assign the selected student to the enrollment
            course: selectedCourse, // Assign the selected course to the enrollment
        });

        await newEnrollment.save();
        res.redirect('/enrollment');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the enrollment data." });
    }
})

app.delete("/delete/enrollment/:enrollmentId", async (req, res) => {
    const enrollmentIdToDelete = req.params.enrollmentId;

    try {
        const result = await enrollment.findByIdAndDelete(enrollmentIdToDelete);
        console.log("Deleted enrollment:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/enrollment/:enrollmentId", async (req, res) => {
    console.log('updating...')
    const enrollmentIdToUpdate = req.params.enrollmentId;
    console.log('Here is thy tea master ', enrollmentIdToUpdate)

    try {
        const updatedEnrollment = await enrollment.findByIdAndUpdate(
            enrollmentIdToUpdate,
            {
                student: req.body.student,
                course: req.body.course,
                date: req.body.date,
                status: req.body.status,
            },
            { new: true }
        );
        
        if (!updatedEnrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }
        console.log("Updated:", updatedEnrollment);
        res.status(200).json(updatedEnrollment);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.get("/grade", async (req, res) => {
    try {
        const gradeList = await grade.find({});
        res.render("grade", { details: gradeList });
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the enrollment data." });
    }
})

app.post("/grade", async (req, res) => {
    console.log('posting...')
    const nextGradeId = await grade.countDocuments({}) + 1001;
    try {
        let newGrade = new grade({
            id: nextGradeId,
            grade: req.body.grade,
            exam: req.body.exam,
            finalGrade: req.body.finalGrade,
            semester: req.body.semester
        });

        await newGrade.save();
        res.redirect('/grade');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the enrollment data." });
    }
})

app.delete("/delete/grade/:gradeId", async (req, res) => {
    const gradeIdToDelete = req.params.gradeId;

    try {
        const result = await grade.findByIdAndDelete(gradeIdToDelete);
        console.log("Deleted grade:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/grade/:gradeId", async (req, res) => {
    console.log('updating...')
    const gradeIdToUpdate = req.params.gradeId;
    console.log('Here is thy tea master ', gradeIdToUpdate)

    try {
        const updatedGrade = await grade.findByIdAndUpdate(
            gradeIdToUpdate,
            {
                grade: req.body.grade,
                exam: req.body.exam,
                finalGrade: req.body.finalGrade,
                semester: req.body.semester
            },
            { new: true }
        );
        
        if (!updatedGrade) {
            return res.status(404).json({ error: "Grade not found" });
        }
        console.log("Updated:", updatedGrade);
        res.status(200).json(updatedGrade);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.get("/semester", async (req, res) => {
    try {
        const semesterList = await semester.find({});
        res.render("semester", { details: semesterList });
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the semester data." });
    }
})

app.post("/semester", async (req, res) => {
    console.log('posting...')
    const nextSemesterId = await semester.countDocuments({}) + 1001;

    try {
        let newSemester = new semester({
            id: nextSemesterId,
            semesterName: req.body.semesterName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            registrationDeadline: req.body.registrationDeadline
        });

        await newSemester.save();
        res.redirect('/semester');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the semester data." });
    }
})

app.delete("/delete/semester/:semesterId", async (req, res) => {
    const semesterIdToDelete = req.params.semesterId;

    try {
        const result = await semester.findByIdAndDelete(semesterIdToDelete);
        console.log("Deleted semester:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/semester/:semesterId", async (req, res) => {
    console.log('updating...')
    const semesterIdToUpdate = req.params.semesterId;
    console.log('Here is thy tea master ', semesterIdToUpdate)

    try {
        const updatedSemester = await semester.findByIdAndUpdate(
            semesterIdToUpdate,
            {
                semesterName: req.body.semesterName,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                registrationDeadline: req.body.registrationDeadline
            },
            { new: true }
        );
        
        if (!updatedSemester) {
            return res.status(404).json({ error: "Semester not found" });
        }
        console.log("Updated:", updatedSemester);
        res.status(200).json(updatedSemester);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.get("/payment", async (req, res) => {
    try {
        const paymentList = await payment.find({});
        res.render("payment", { details: paymentList });
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the payment data." });
    }
})

app.post("/payment", async (req, res) => {
    console.log('posting...')
    const nextPaymentId = await payment.countDocuments({}) + 1001;
    try {
        let newPayment = new payment({
            id: nextPaymentId,
            paymentAmount: req.body.paymentAmount,
            paymentDate: req.body.paymentDate,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: req.body.paymentStatus
        });

        await newPayment.save();
        res.redirect('/payment');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the payment data." });
    }
})

app.delete("/delete/payment/:paymentId", async (req, res) => {
    const paymentIdToDelete = req.params.paymentId;

    try {
        const result = await payment.findByIdAndDelete(paymentIdToDelete);
        console.log("Deleted payment:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/payment/:paymentId", async (req, res) => {
    console.log('updating...')
    const paymentIdToUpdate = req.params.paymentId;
    console.log('Here is thy tea master ', paymentIdToUpdate)

    try {
        const updatedPayment = await payment.findByIdAndUpdate(
            paymentIdToUpdate,
            {
                paymentAmount: req.body.paymentAmount,
                paymentDate: req.body.paymentDate,
                paymentMethod: req.body.paymentMethod,
                paymentStatus: req.body.paymentStatus
            },
            { new: true }
        );
        
        if (!updatedPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        console.log("Updated:", updatedPayment);
        res.status(200).json(updatedPayment);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.get("/notification", async (req, res) => {
    try {
        const notificationList = await notification.find({});
        res.render("notification", { details: notificationList });
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while loading the notification data." });
    }
})

app.post("/notification", async (req, res) => {
    console.log('posting...')
    const nextNotificationId = await notification.countDocuments({}) + 1001;
    try {
        let newNotification = new notification({
            id: nextNotificationId,
            type: req.body.type,
            content: req.body.content,
            timestamp: req.body.timestamp,
            status: req.body.status
        });

        await newNotification.save();
        res.redirect('/notification');
    } catch (err) {
        console.error(err);
        res.render("error", { errorMessage: "An error occurred while saving the notification data." });
    }
})

app.delete("/delete/notification/:notificationId", async (req, res) => {
    const notificationIdToDelete = req.params.notificationId;

    try {
        const result = await notification.findByIdAndDelete(notificationIdToDelete);
        console.log("Deleted notification:", result);
        res.sendStatus(200); // Send a success status
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});

app.put("/update/notification/:notificationId", async (req, res) => {
    console.log('updating...')
    const notificationIdToUpdate = req.params.notificationId;
    console.log('Here is thy tea master ', notificationIdToUpdate)

    try {
        const updatedNotification = await notification.findByIdAndUpdate(
            notificationIdToUpdate,
            {
                type: req.body.type,
                content: req.body.content,
                timestamp: req.body.timestamp,
                status: req.body.status
            },
            { new: true }
        );
        
        if (!updatedNotification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        console.log("Updated:", updatedNotification);
        res.status(200).json(updatedNotification);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Send a server error status
    }
});