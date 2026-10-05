let express = require('express');
let cors = require('cors');
let multer = require('multer');
let app = express();
const db = require('./Database');
const firebaseAuth=require('./FirebaseAuth');
const path = require("path");



// Middleware to parse JSON request body
app.use(express.json());

// Allow CORS for frontend (localhost:3000)
app.use(cors({
    origin: "*",   // React frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: false
}));



// ===== Multer Setup =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});
const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profile/'); // folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});
const storageEvent = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Event/'); // folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});
const storageRegistration = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Registration/'); // folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});


const upload = multer({ storage: storage });
const profile=multer({storage:storageProfile})
const Event=multer({storage:storageEvent})


app.use("/uploads", express.static("uploads"));
app.use("/profile", express.static("profile"));
app.use("/Event", express.static("Event"));
app.use("/Registration", express.static("Registration"));



//============Fees============

// Insert Fees
/* ================= FEES CRUD ROUTES (UPDATED) ================= */

// Insert Fees
app.post('/FeesInsert', async function (req, res) {
    try {
        const { studentId, courseId, amount, date, transactionId } = req.body;

        const result = await db.FeesInsert(
            studentId,
            courseId,
            amount,
            date,
            transactionId
        );

        res.json(result);
    } catch (error) {
        console.error('Error inserting fees:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update Fees
app.post('/FeesUpdate', async function (req, res) {
    try {
        const { id, studentId, courseId, amount, date, transactionId } = req.body;

        const result = await db.FeesUpdate(
            id,
            studentId,
            courseId,
            amount,
            date,
            transactionId
        );

        res.json(result);
    } catch (error) {
        console.error('Error in /FeesUpdate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete Fees
app.post('/FeesDelete', async function (req, res) {
    try {
        const { id } = req.body;

        const result = await db.FeesDelete(id);
        res.json(result);
    } catch (error) {
        console.error('Error in /FeesDelete:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read All Fees
app.post('/FeesRead', async function (req, res) {
    try {
        const result = await db.FeesRead();
        res.json(result);
    } catch (error) {
        console.error('Error in /FeesRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read Fees by StudentId
app.post('/FeesReadByStudentID', async function (req, res) {
    try {
        const { studentId } = req.body;
        console.log(studentId);

        const result = await db.FeesReadByStudentId(studentId);
        res.json(result);
        
    } catch (error) {
        console.error('Error in /FeesRead/:studentId:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// FEES DASHBOARD DATA (Total Fees + Trending Course)
app.post('/FeesDashboardData', async function (req, res) {
    try {
        const result = await db.FeesDashboardData();

        console.log('--- Fees Dashboard Data ---');
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error('❌ Error in /FeesDashboardData:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fees dashboard data',
            error: error.message
        });
    }
});
app.post("/salary/read", async (req, res) => {
    try {
        const query = `
            SELECT Id, facultyId, transactionId, amount, date
            FROM salary
            WHERE facultyId = ?
            ORDER BY date DESC
        `;
        const [rows] = await dbPromise.query(query, [req.body.facultyId]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// ================= INSERT SALARY =================
app.post("/get-salaries-by-registration", async (req, res) => {
    try {
        const { registrationId } = req.body;

        // Validation
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                error: "Missing registrationId"
            });
        }

        // Call existing model/service method
        const result = await db.getSalariesByRegistration(registrationId);

        // Success response
        if (result.success) {
            return res.status(200).json(result);
        }

        // Logical failure response
        return res.status(400).json(result);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post("/salary/insert", async (req, res) => {
    try {
        const {
            facultyId,
            transactionId,
            amount,
            date
        } = req.body;

        // Validate required fields
        if (!facultyId || !transactionId || !date) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: facultyId, transactionId, or date"
            });
        }

        const result = await db.insertSalary({
            facultyId,
            transactionId,
            amount: amount || 0, // Provide default if amount is missing
            date
        });

        res.json(result);
    } catch (error) {
        console.error("Server error while inserting salary:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// ================= UPDATE SALARY =================
app.put("/salary/update/:id", async (req, res) => {
    try {
        const {
            transactionId,
            amount,
            date
        } = req.body;

        const id = req.params.id;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Missing required field: Id"
            });
        }

        const result = await db.updateSalary({
            Id: id,
            transactionId,
            amount,
            date
        });

        res.json(result);
    } catch (error) {
        console.error("Server error while updating salary:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// ================= DELETE SALARY =================
app.delete("/salary/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Validate required field
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Missing required field: Id"
            });
        }

        const result = await db.deleteSalaryById(id);

        res.json(result);
    } catch (error) {
        console.error("Server error while deleting salary:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});
// // ================= FACULTY SALARY PAYMENT (ONLY ON SUCCESS) =================



// ================= SALARY DASHBOARD =================
app.post("/SalaryDashboardData", async (req, res) => {
    try {
        const query = `
            SELECT
                COUNT(*) AS totalPayments,
                SUM(amount) AS totalAmount,
                MAX(date) AS lastPaymentDate
            FROM salary
        `;
        const [rows] = await dbPromise.query(query);
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch salary dashboard data",
            error: error.message
        });
    }
});










    //============Fees============

//============Courses============
app.post('/CoursesInsert', upload.single('image'), async function (req, res) {
    try {
        const { name, description, fees, sylabus, duration } = req.body;

        // multer adds file info in req.file
        const imageName = req.file ? req.file.filename : null;

        const result = await db.CoursesInsert(
            name,
            description,
            fees,
            sylabus,
            duration,
            imageName
        );

        res.json({ success: true, result, image: imageName });
    } catch (error) {
        console.error('Error inserting course:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



app.post('/CoursesUpdate', upload.single('image'), async function (req, res) {
    try {
        const { id, name, description, fees, sylabus, duration, Oldimage } = req.body;

        // If new image uploaded, take that, else keep Oldimage
        const imageName = req.file ? req.file.filename : Oldimage;

        // Call your DB update method
        const result = await db.CoursesUpdate(
            id,
            name,
            description,
            fees,
            sylabus,
            duration,
            imageName
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error in /CoursesUpdate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.post('/CoursesDelete', async function (req, res) {
    try {
        const { id } = req.body;

        // Print the id in console
        const result = await db.CoursesDelete(id);

        res.json(result);
    } catch (error) {
        console.error('Error in /CoursesDelete:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


/*app.post('/CoursesRead', async function (req, res) {
    try {
        const result = await db.CoursesRead();

        res.json(result);
    } catch (error) {
        console.error('Error in /CoursesRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});*/
app.post('/CoursesRead', async function (req, res) {
    try {
        // Extract search from body
        const { search } = req.body;
        // Pass search term to DB function
        const result = await db.CoursesRead(search);

        res.json(result);
    } catch (error) {
        console.error('Error in /CoursesRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/CoursesReadNotforStudent', async function (req, res) {
    try {
        // Extract search from body
        const { search,studentId } = req.body;
        // Pass search term to DB function
        const result = await db.CoursesReadNotforStudent(search,studentId);

        res.json(result);
    } catch (error) {
        console.error('Error in /CoursesRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/CoursesReadforStudent', async function (req, res) {
    try {
        // Extract search from body
        const { search,studentId } = req.body;
        // Pass search term to DB function
        const result = await db.CoursesReadforStudent(search,studentId);

        res.json(result);
    } catch (error) {
        console.error('Error in /CoursesRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Read courses assigned to a faculty (Instructor)
app.post('/ReadCourseForFaculty', async function (req, res) {
    try {
        // Extract InstructorId from request body
        const { InstructorId } = req.body;

        // Validation
        if (!InstructorId) {
            return res.status(400).json({
                success: false,
                message: "InstructorId is required"
            });
        }

        // Call DB function
        const result = await db.ReadCourseForFaculty(InstructorId);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error in /ReadCourseForFaculty:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
app.post('/CoursesReadForStudentWithBatch', async function (req, res) {
    try {
        // Extract search & studentId from request body
        const { search, studentId } = req.body;

        // Call DB function
        const result = await db.CoursesReadForStudentWithBatch(search, studentId);

        res.json(result);

    } catch (error) {
        console.error('Error in /CoursesReadForStudentWithBatch:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            data: []
        });
    }
});



//============Courses============
//===========Account============
// ================= Faculty Bank Details =================

// INSERT Faculty Bank Details
app.post("/faculty-bank/insert", async (req, res) => {
    const {
        facultyId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber,
    } = req.body;

    const result = await db.FacultyBankInsert(
        facultyId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber
    );

    res.json(result);
    console.log(salaryType);
    console.log(accountType);
});

// READ Faculty Bank Details by Faculty ID
app.post("/faculty-bank/read", async (req, res) => {
    const { facultyId } = req.body;

    const result = await db.FacultyBankReadByFacultyId(facultyId);

    res.json(result);
});

// UPDATE Faculty Bank Details
app.post("/faculty-bank/update", async (req, res) => {
    const {
        facultyId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber,
    } = req.body;

    const result = await db.FacultyBankUpdate(
        facultyId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber
    );

    res.json(result);
});

// DELETE Faculty Bank Details
app.post("/faculty-bank/delete", async (req, res) => {
    const { facultyId } = req.body;

    const result = await db.FacultyBankDelete(facultyId);

    res.json(result);
});

// ================= Faculty Bank Details =================
//=============Event==============
// Insert Event
app.post('/EventsInsert', Event.single('Image'), async function (req, res) {
    try {
        const { Name, DateTime, Location, Description, GoogleFormLink, Participants, Category } = req.body;
        const imageName = req.file ? req.file.filename : null;


        const result = await db.EventsInsert(
            Name,
            DateTime,
            Location,
            Description,
            GoogleFormLink,
            Participants,
            Category,
            imageName
        );

        res.json(result);
    } catch (error) {
        console.error('Error inserting event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Update Event
app.post('/EventsUpdate', Event.single('Image'), async function (req, res) {
    try {
        const { Id, Name, DateTime, Location, Description, GoogleFormLink, Participants, Category, OldImage } = req.body;
        const imageName = req.file ? req.file.filename : OldImage;

        // Print all fields and their values
        console.log('--- Incoming Event Data ---');
        console.log('Id:', Id);
        console.log('Name:', Name);
        console.log('DateTime:', DateTime);
        console.log('Location:', Location);
        console.log('Description:', Description);
        console.log('GoogleFormLink:', GoogleFormLink);
        console.log('Participants:', Participants);
        console.log('Category:', Category);
        console.log('OldImage:', OldImage);
        console.log('Final Image used:', imageName);

        if (req.file) {
            console.log('--- Uploaded File Info ---');
            console.log('Original Filename:', req.file.originalname);
            console.log('Stored Filename:', req.file.filename);
            console.log('Mimetype:', req.file.mimetype);
            console.log('File Size (bytes):', req.file.size);
        } else {
            console.log('No new image uploaded. Using OldImage.');
        }

        const result = await db.EventsUpdate(
            Id,
            Name,
            DateTime,
            Location,
            Description,
            GoogleFormLink,
            Participants,
            Category,
            imageName
        );

        console.log('--- DB Update Result ---');
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error('Error in /EventsUpdate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



// Delete Event
app.post('/EventsDelete', async function (req, res) {
    try {
        const { Id } = req.body;
        const result = await db.EventsDelete(Id);
        res.json(result);
    } catch (error) {
        console.error('Error in /EventsDelete:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Read Event
app.post('/EventsRead', async function (req, res) {
    try {
        const { search = "" } = req.body;
        const result = await db.EventsRead(search);
        res.json(result);
    } catch (error) {
        console.error('Error in /EventsRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//============Event================

//==================Faculty===============
//============ Faculty ============

// ============ Faculty Routes ============

// Insert Faculty
// ✅ Strong Password Generator Function
function generateStrongPassword(length = 8) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+{}[]|:;<>,.?/~`-=";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}

app.post('/FacultyInsert', profile.single('image'), async function (req, res) {
    try {
        const { name, mobile, address, email, courses } = req.body;
        // const imageName = req.file.filename;
// Check if a file was uploaded (req.file exists).
// If it does, use the filename.
// If it doesn't (is null/undefined), use "user.png" as the default.
        const imageName = req.file ? req.file.filename : "user.png";
        // Insert into your database

        // ✅ Generate strong password for Firebase user
        const randomPassword = generateStrongPassword();

        // Create Firebase user with generated password
        const r = await firebaseAuth.firebaseCreateuser(email, randomPassword);

        if(r.success){
            const result=await db.RegistrationInsert(r.uid, imageName, name, "Faculty", mobile, "");


            await db.FacultyInsert(name, mobile, address, email, courses, imageName,result.id);
            res.json({
                success: true,
                message: "Faculty registered successfully!",
                facultyData: result,
                loginCredentials: {
                    r:r,
                    email: email,
                    password: randomPassword // ✅ Send it back so Admin can inform user or store
                }
            });


        }
        console.log("Generated Password for Faculty:", randomPassword);


    } catch (error) {
        console.error('Error inserting faculty:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Update Faculty
app.post('/FacultyUpdate', profile.single('image'), async function (req, res) {
    try {
        const { id, name, mobile, address, email, courses, oldImage } = req.body;
        const imageName = req.file ? req.file.filename : oldImage;

        const result = await db.FacultyUpdate(id, name, mobile, address, email, courses, imageName);
        res.json(result);
    } catch (error) {
        console.error('Error in /FacultyUpdate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Delete Faculty
app.post('/FacultyDelete', async function (req, res) {
    try {
        const { id } = req.body;
        const result = await db.FacultyDelete(id);
        res.json(result);
    } catch (error) {
        console.error('Error in /FacultyDelete:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Read Faculty
app.post('/FacultyRead', async function (req, res) {
    try {
        const { search = "" } = req.body; // default to empty string if not provided
        const result = await db.FacultyRead(search);
        res.json(result);
    } catch (error) {
        console.error('Error in /FacultyRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

//==================Faculty================================









// -------- Insert Registration --------
app.post('/RegistrationInsert', async function (req, res) {
    try {
        const { DocId, Name, UserType, Mobile, Qualification } = req.body;
        const profileImageName = "user.png";

        const result = await db.RegistrationInsert(
            DocId,
            profileImageName,
            Name,
            UserType,
            Mobile,
            Qualification
        );

        console.log('--- Registration Insert Result ---');
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error('Error inserting registration:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// -------- Update Registration --------
// -------- Update Registration --------
app.post('/RegistrationUpdate', profile.single('Profile'), async function (req, res) {
    try {
        const { Id, Name, Mobile, Qualification, OldProfile } = req.body;
        const profileImageName = req.file ? req.file.filename : OldProfile;


        // Update record while preserving DocId and UserType
        const result = await db.RegistrationUpdate(
            Id,
            profileImageName,
            Name,
            Mobile,
            Qualification
        );

        console.log('--- Registration Update Result ---');
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error('Error in /RegistrationUpdate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// -------- Read Registrations --------
app.post('/RegistrationRead', async function (req, res) {
    try {
        const { docId, displayName } = req.body;

        console.log('--- Registration Read Search Query ---');

        let result = await db.RegistrationRead(docId);

        if (result.data.length === 0) {
            await db.RegistrationInsert(docId, "User.png", displayName, "Student", "", "");
            result = await db.RegistrationRead(docId);
        }

        // send only once
        res.json(result);

    } catch (error) {
        console.error('Error in /RegistrationRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/GetEnrolledStudentsNotAllocated", async (req, res) => {
    try {
        console.log("Fetching enrolled students not allocated to batch");

        const result = await db.GetEnrolledStudentsNotAllocated();

        res.json(result);
    } catch (error) {
        console.error("Error fetching enrolled students:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/GetEnrolledStudentsAllocated", async (req, res) => {
    try {
        const result = await db.GetEnrolledStudentsAllocated();

        if (!result || result.success !== true) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch allocated students"
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching allocated students:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// Student count + latest 5 students
app.post('/StudentDashboardData', async function (req, res) {
    try {
        const result = await db.StudentDashboardDataSingleQuery();

        console.log('--- Student Dashboard Data ---');
        console.log(result);

        res.json(result);
    } catch (error) {
        console.error('❌ Error in /StudentDashboardData:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student dashboard data',
            error: error.message
        });
    }
});


//=========================BatchTime================

app.post("/BatchTimeAllocatedInsert", async (req, res) => {
    try {
        const {
            STUDENTID,
            COURSEID,
            BATCHID
        } = req.body;

        // Mandatory validation
        if (!STUDENTID || !COURSEID || !BATCHID) {
            return res.status(400).json({
                success: false,
                message: "STUDENTID, COURSEID, and BATCHID are required"
            });
        }

        // New allocation defaults
        const COURSECOMPLETED = "NO";
        const CERTIFICATEISSUED = "NO";
        const CODATE = null;
        const CERDATE = null;

        const result = await db.BatchTimeAllocatedInsert(
            STUDENTID.toString(),
            COURSEID.toString(),
            BATCHID.toString(),
            COURSECOMPLETED,
            CERTIFICATEISSUED,
            CODATE,
            CERDATE
        );

        res.status(200).json(result);

    } catch (error) {
        console.error("Error inserting BatchTimeAllocated:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/* =========================
   UPDATE COURSE COMPLETION
   ========================= */
app.post("/UpdateCourseCompletion", async (req, res) => {
    try {
        const { STUDENTID, COURSEID } = req.body;

        if (!STUDENTID || !COURSEID) {
            return res.status(400).json({
                success: false,
                message: "STUDENTID and COURSEID are required"
            });
        }

        const COURSECOMPLETED = "YES";
        const CODATE = new Date().toISOString().slice(0, 19).replace("T", " ");

        const result = await db.UpdateCourseCompletion(
            String(STUDENTID),
            String(COURSEID),
            COURSECOMPLETED,
            CODATE
        );

        if (!result.success) {
            return res.status(409).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "Course marked as completed successfully"
        });

    } catch (error) {
        console.error("Error updating course completion:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});


/* =========================
   UPDATE CERTIFICATE ISSUE
   ========================= */
app.post("/UpdateCertificateIssue", async (req, res) => {
    try {
        const { STUDENTID, COURSEID } = req.body;

        if (!STUDENTID || !COURSEID) {
            return res.status(400).json({
                success: false,
                message: "STUDENTID and COURSEID are required"
            });
        }

        const CERTIFICATEISSUED = "YES";
        const CERDATE = new Date().toISOString().slice(0, 19).replace("T", " ");

        const result = await db.UpdateCertificateIssue(
            String(STUDENTID),
            String(COURSEID),
            CERTIFICATEISSUED,
            CERDATE
        );

        if (!result.success) {
            return res.status(409).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "Certificate issued successfully"
        });

    } catch (error) {
        console.error("Error updating certificate issue:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});
app.post("/UpdateStudentBatch", async (req, res) => {
    try {
        const { STUDENTID, COURSEID, BATCHID } = req.body;



        if (!STUDENTID || !COURSEID || !BATCHID) {
            return res.status(400).json({
                success: false,
                message: "STUDENTID, COURSEID and BATCHID are required"
            });
        }


        const result = await db.UpdateStudentBatch(
            String(STUDENTID),
            String(COURSEID),
            String(BATCHID)
        );

        if (!result.success) {
            return res.status(409).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "Student batch updated successfully"
        });

    } catch (error) {
        console.error("Error updating student batch:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});




app.post("/BatchTimeInsert", async (req, res) => {
    try {
        const { Title, StartTime, EndTime, InstructorId, CourseId } = req.body;
        const result = await db.BatchTimeInsert(Title, StartTime, EndTime, InstructorId, CourseId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post("/BatchTimeUpdate", async (req, res) => {
    try {
        const { Id, Title, StartTime, EndTime, InstructorId, CourseId } = req.body;
        const result = await db.BatchTimeUpdate(Id, Title, StartTime, EndTime, InstructorId, CourseId);
        res.json(result);
    } catch (error) {
        console.error("Error updating batch time:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🟥 DELETE
app.post("/BatchTimeDelete", async (req, res) => {
    try {
        const { Id } = req.body;
        const result = await db.BatchTimeDelete(Id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting batch time:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/BatchTimeRead', async function (req, res) {
    try {
        const { search = "" } = req.body;

        // BatchTimeRead already returns rows array
        const result = await db.BatchTimeRead(search);

        res.json({ success: true, data: result });

    } catch (error) {
        console.error('❌ Error in /BatchTimeRead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/BatchTimeReadByCourseId', async function (req, res) {
    try {
        const { CourseId } = req.body;

        if (!CourseId) {
            return res.json({
                success: false,
                message: "CourseId is required"
            });
        }

        // Call model method
        const result = await db.BatchTimeReadByCourseId(Number(CourseId));

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Error in /BatchTimeReadByCourseId:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});















// ===== Start Server =====
let server = app.listen(3022, function () {
    console.log('Server Started');
    console.log('Example app listening at http://localhost:3022');
});
