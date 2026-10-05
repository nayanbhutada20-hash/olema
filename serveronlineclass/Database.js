const mysql = require('mysql2');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'NAYAN',
            database: 'onlineeducation',
            waitForConnections: true,
            connectionLimit: 10,   // max concurrent connections
            queueLimit: 0
        });

        this.dbPromise = this.pool.promise();

        console.log('✅ MySQL Pool created');
    }
//============Fees============
    async SalaryReadByFacultyId(facultyId) {
        const query = `
            SELECT 
                s.Id,
                s.facultyId,
                s.transactionId,
                s.amount,
                s.date
            FROM salary s
            WHERE s.facultyId = ?
            ORDER BY s.date DESC
        `;

        try {
            const [rows] = await this.dbPromise.query(query, [facultyId]);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading salary by facultyId:", error);
            return { success: false, error: error.message };
        }
    }

    // ================= INSERT SALARY =================
    // ================= INSERT SALARY FROM FACULTY BANK DETAILS =================
    // ================= INSERT SALARY =================
    async insertSalary(data) {
        // Validate input data
        if (!data || !data.transactionId || !data.date || !data.facultyId) {
            return {
                success: false,
                error: "Missing required fields: transactionId, date, or facultyId"
            };
        }

        const query = `
        INSERT INTO salary (facultyId, transactionId, amount, date)
        VALUES (?, ?, ?, ?)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                data.facultyId,
                data.transactionId,
                data.amount || 0, // Provide default if amount is missing
                data.date
            ]);

            return {
                success: true,
                insertId: result.insertId
            };
        } catch (error) {
            console.error("Error inserting salary:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
//======================read salary ===========================
    async getSalariesByRegistration(registrationId) {
        // Validate input
        if (!registrationId) {
            return {
                success: false,
                error: "Missing registrationId"
            };
        }

        const query = `
        SELECT 
            s.Id AS salaryId,
            s.transactionId,
            s.amount,
            s.date,
            f.Id AS facultyId,
            f.Name AS facultyName,
            f.Mobile AS facultyMobile
        FROM 
            registration r
        JOIN 
            faculty f ON f.FacultyId = r.Id
        JOIN 
            salary s ON s.facultyId = f.Id
        WHERE 
            r.Id = ?
    `;

        try {
            const [rows] = await this.dbPromise.query(query, [registrationId]);

            return {
                success: true,
                data: rows
            };
        } catch (error) {
            console.error("Error fetching salaries:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

// Usage example:
// const result = await getSalariesByRegistration(33);
// ================= UPDATE SALARY =================
    async updateSalary(data) {
        // Validate input data
        if (!data || !data.Id) {
            return {
                success: false,
                error: "Missing required field: Id"
            };
        }

        const query = `
        UPDATE salary
        SET transactionId = ?, amount = ?, date = ?
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                data.transactionId,
                data.amount,
                data.date,
                data.Id
            ]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    error: "No salary record found with the provided Id"
                };
            }

            return {
                success: true,
                affectedRows: result.affectedRows
            };
        } catch (error) {
            console.error("Error updating salary:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

// ================= DELETE SALARY =================
    async deleteSalaryById(id) {
        // Validate input
        if (!id) {
            return {
                success: false,
                error: "Missing required field: Id"
            };
        }

        const query = `
        DELETE FROM salary
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [id]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    error: "No salary record found with the provided Id"
                };
            }

            return {
                success: true,
                affectedRows: result.affectedRows
            };
        } catch (error) {
            console.error("Error deleting salary:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /* ================= FEES CRUD OPERATIONS ================= */

    async FeesInsert(studentId, courseId, amount, date, transactionId) {
        const query = `
        INSERT INTO fees (StudentID, CourseID, Amount, Date, TransactionID)
        VALUES (?, ?, ?, ?, ?)
    `;
        try {
            const [result] = await this.dbPromise.query(query, [
                studentId,
                courseId,
                amount,
                date,
                transactionId
            ]);
            return { success: true, id: result.insertId };
        } catch (error) {
            console.error("Error inserting fees:", error);
            return { success: false, error: error.message };
        }
    }

    async FeesRead() {
        const query = `
        SELECT 
            f.Id AS FeesId,
            f.StudentID,
            IFNULL(r.Name, 'Unknown Student') AS StudentName,
            IFNULL(c.Name, 'Unknown Course') AS CourseName,
            f.Amount,
            f.Date,
            f.TransactionID
        FROM fees f
        LEFT JOIN Registration r ON f.StudentID = r.Id
        LEFT JOIN course c ON f.CourseID = c.Id
        ORDER BY f.Date DESC
    `;

        try {
            const [rows] = await this.dbPromise.query(query);

            // ✅ DEBUG: Log fetched records
            console.log("FeesRead Records:", rows);

            return {
                success: true,
                data: rows
            };
        } catch (error) {
            console.error("Error reading fees (Admin):", error);
            return {
                success: false,
                error: error.message
            };
        }
    }



    async FeesReadById(id) {
        const query = `SELECT * FROM fees WHERE Id = ?`;
        try {
            const [rows] = await this.dbPromise.query(query, [id]);
            return { success: true, data: rows[0] };
        } catch (error) {
            console.error("Error reading fees by Id:", error);
            return { success: false, error: error.message };
        }
    }
    async FeesReadByStudentId(studentId) {
        const query = `
        SELECT 
            f.Id,
            c.Name AS CourseName,
            f.Amount,
            f.Date,
            f.TransactionID
        FROM fees f
        INNER JOIN course c ON f.CourseID = c.Id
        WHERE f.StudentID = ?
        ORDER BY f.Date DESC
    `;

        try {
            const [rows] = await this.dbPromise.query(query, [studentId]);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading fees by StudentId:", error);
            return { success: false, error: error.message };
        }
    }

    async FeesUpdate(id, studentId, courseId, amount, date, transactionId) {
        const query = `
        UPDATE fees
        SET StudentID = ?,
            CourseID = ?,
            Amount = ?,
            Date = ?,
            TransactionID = ?
        WHERE Id = ?
    `;
        try {
            const [result] = await this.dbPromise.query(query, [
                studentId,
                courseId,
                amount,
                date,
                transactionId,
                id
            ]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error updating fees:", error);
            return { success: false, error: error.message };
        }
    }

    async FeesDelete(id) {
        const query = `DELETE FROM fees WHERE Id = ?`;
        try {
            const [result] = await this.dbPromise.query(query, [id]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error deleting fees:", error);
            return { success: false, error: error.message };
        }
    }
    // FEES DASHBOARD DATA (Single Hit)
    async FeesDashboardData() {
        try {
            const query = `
            SELECT
                (SELECT IFNULL(SUM(Amount),0) FROM fees) AS total_fees_collected,
                f.CourseID,
                COUNT(*) AS total_students,
                SUM(f.Amount) AS course_amount
            FROM fees f
            GROUP BY f.CourseID
            ORDER BY total_students DESC
            LIMIT 1
        `;

            const [rows] = await this.dbPromise.query(query);

            return {
                success: true,
                total_fees_collected: rows.length ? rows[0].total_fees_collected : 0,
                trending_course: rows.length ? {
                    CourseID: rows[0].CourseID,
                    total_students: rows[0].total_students,
                    total_amount: rows[0].course_amount
                } : null
            };
        } catch (error) {
            console.error("❌ Error in FeesDashboardData:", error);
            throw error;
        }
    }
// FEES DASHBOARD DATA (Total Fees + Trending Course)
// FEES DASHBOARD DATA (Single Hit)
    async FeesDashboardData() {
        try {
            const query = `
            SELECT
                (SELECT IFNULL(SUM(Amount),0) FROM fees) AS total_fees_collected,
                f.CourseID,
                COUNT(*) AS total_students,
                SUM(f.Amount) AS course_amount
            FROM fees f
            GROUP BY f.CourseID
            ORDER BY total_students DESC
            LIMIT 1
        `;

            const [rows] = await this.dbPromise.query(query);

            return {
                success: true,
                total_fees_collected: rows.length ? rows[0].total_fees_collected : 0,
                trending_course: rows.length ? {
                    CourseID: rows[0].CourseID,
                    total_students: rows[0].total_students,
                    total_amount: rows[0].course_amount
                } : null
            };
        } catch (error) {
            console.error("❌ Error in FeesDashboardData:", error);
            throw error;
        }
    }


//============Fees============



    //============Courses============
    async CoursesInsert(name, description, fees, sylabus, duration, image) {
        const query = `
        INSERT INTO course (Name, Description, Fees, Sylabus, Duration, Image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                name,
                description,
                fees,
                sylabus,
                duration,
                image
            ]);

            return { success: true, id: result.insertId };
        } catch (error) {
            console.error('Error inserting course:', error);
            return { success: false, error };
        }
    }

    async CoursesDelete(id) {
        const query = `
        DELETE FROM course
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [id]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error('Error deleting course:', error);
            return { success: false, error };
        }
    }

    async CoursesUpdate(id, name, description, fees, sylabus, duration, image) {
        const query = `
        UPDATE course
        SET Name = ?, 
            Description = ?, 
            Fees = ?, 
            Sylabus = ?, 
            Duration = ?, 
            Image = ?
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                name,
                description,
                fees,
                sylabus,
                duration,
                image,
                id
            ]);

            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error('Error updating course:', error);
            return { success: false, error };
        }
    }

    /*async CoursesRead() {
        const query = 'SELECT * FROM course';
        try {
            const [rows] = await this.dbPromise.query(query);
            return rows;
        } catch (error) {
            console.error('Error reading courses:', error);
            return [];
        }
    }*/

    async CoursesRead(search = "") {
        try {
            let query = "SELECT * FROM course";
            let values = [];

            // If search exists, apply filter
            if (search && search.trim() !== "") {
                query += " WHERE Name LIKE ? OR Description LIKE ?";
                values.push(`%${search}%`, `%${search}%`);
            }

            const [rows] = await this.dbPromise.query(query, values);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading courses:", error);
            return { success: false, error: error.message, data: [] };
        }
    }

    async CoursesReadforStudent(search = "", studentId) {
        try {
            let query = `
            SELECT *
            FROM course
            WHERE Id Not IN (
                SELECT CourseId
                FROM fees
                WHERE StudentId = ?
            )
        `;

            let values = [studentId];

            // Apply search filter
            if (search && search.trim() !== "") {
                query += " AND (Name LIKE ? OR Description LIKE ?)";
                values.push(`%${search}%`, `%${search}%`);
            }

            const [rows] = await this.dbPromise.query(query, values);
            return { success: true, data: rows };

        } catch (error) {
            console.error("Error reading courses:", error);
            return { success: false, error: error.message, data: [] };
        }
    }

    async CoursesReadNotforStudent(search = "", studentId) {
        try {
            let query = `
            SELECT *
            FROM course
            WHERE Id IN (
                SELECT CourseId
                FROM fees
                WHERE StudentId = ?
            )
        `;

            let values = [studentId];

            // Apply search filter
            if (search && search.trim() !== "") {
                query += " AND (Name LIKE ? OR Description LIKE ?)";
                values.push(`%${search}%`, `%${search}%`);
            }

            const [rows] = await this.dbPromise.query(query, values);
            return { success: true, data: rows };

        } catch (error) {
            console.error("Error reading courses:", error);
            return { success: false, error: error.message, data: [] };
        }
    }
    async CoursesReadForStudentWithBatch(search = "", studentId) {
        try {
            let query = `
            SELECT 
                c.Id                AS CourseId,
                c.Name              AS CourseName,
                c.Description,
                c.Fees,
                c.Image,
                c.Sylabus,

                bt.Id               AS BatchId,
                bt.Title            AS BatchName,
                bt.StartTime,
                bt.EndTime,

                bta.COURSECOMPLETED,
                bta.CERTIFICATEISSUED,
                bta.CODATE,
                bta.CERDATE

            FROM batchtimeallocated bta
            INNER JOIN batchtime bt 
                ON bt.Id = bta.BATCHID
            INNER JOIN course c
                ON c.Id = bta.COURSEID
            WHERE bta.STUDENTID = ?
        `;

            let values = [studentId];

            // Apply search filter
            if (search && search.trim() !== "") {
                query += `
                AND (
                    c.Name LIKE ?
                    OR c.Description LIKE ?
                    OR bt.Title LIKE ?
                )
            `;
                values.push(
                    `%${search}%`,
                    `%${search}%`,
                    `%${search}%`
                );
            }

            const [rows] = await this.dbPromise.query(query, values);
            return { success: true, data: rows };

        } catch (error) {
            console.error("Error reading allocated courses with batch:", error);
            return { success: false, error: error.message, data: [] };
        }
    }

    //============Courses============
    //==========Faculty==============
// ============ Faculty DB Methods ============

// INSERT Faculty
    // INSERT Faculty
    async FacultyInsert(name, mobile, address, email, courses, image,facultyId) {
        const query = `
        INSERT INTO faculty (Name, Mobile, Address, Email, Courses, Image,FacultyId)
        VALUES (?, ?, ?, ?, ?, ?,?)
    `;
        console.log(`facultyId=${facultyId}`);

        try {
            const [result] = await this.dbPromise.query(query, [
                name,
                mobile,
                address,
                email,
                courses,
                image,
                facultyId
            ]);
            return { success: true, id: result.insertId };
        } catch (error) {
            console.error("Error inserting faculty:", error);
            return { success: false, error: error.message };
        }
    }

// UPDATE Faculty
    async FacultyUpdate(id, name, mobile, address, email, courses, image) {
        const query = `
        UPDATE faculty
        SET Name = ?, 
            Mobile = ?, 
            Address = ?, 
            Email = ?, 
            Courses = ?, 
            Image = ?
        WHERE Id = ?
    `;
        try {
            const [result] = await this.dbPromise.query(query, [
                name,
                mobile,
                address,
                email,
                courses,
                image,
                id
            ]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error updating faculty:", error);
            return { success: false, error: error.message };
        }
    }

// DELETE Faculty
    async FacultyDelete(id) {
        const query = `
        DELETE FROM faculty
        WHERE Id = ?
    `;
        try {
            const [result] = await this.dbPromise.query(query, [id]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error deleting faculty:", error);
            return { success: false, error: error.message };
        }
    }

// READ Faculty (with optional search + includes Image)
    async FacultyRead(search = "") {
        try {
            let query = `
            SELECT Id, Name, Mobile, Address, Email, Courses, Image
            FROM faculty
        `;
            let values = [];

            //If search is provided, apply filter
            if (search && search.trim() !== "") {
                query += " WHERE Name LIKE ? OR Email LIKE ? OR Mobile LIKE ?";
                values.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }


            const [rows] = await this.dbPromise.query(query, values);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading faculty:", error);
            return { success: false, error: error.message, data: [] };
        }
    }



//==================Faculty====================
    //=============Event=======================
    // ==================== Events ===================
    async EventsInsert(Name, DateTime, Location, Description, GoogleFormLink, Participants, Category, Image) {
        const query = `
        INSERT INTO events (Name, DateTime, Location, Description, GoogleFormLink, Participants, Category, Image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                Name,
                DateTime,
                Location,
                Description,
                GoogleFormLink,
                Participants,
                Category,
                Image
            ]);

            return { success: true, id: result.insertId };
        } catch (error) {
            console.error("Error inserting event:", error);
            return { success: false, error: error.message };
        }
    }

    async EventsUpdate(Id, Name, DateTime, Location, Description, GoogleFormLink, Participants, Category, Image) {
        const query = `
        UPDATE events
        SET Name = ?, 
            DateTime = ?, 
            Location = ?, 
            Description = ?, 
            GoogleFormLink = ?, 
            Participants = ?, 
            Category = ?, 
            Image = ?
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                Name,
                DateTime,
                Location,
                Description,
                GoogleFormLink,
                Participants,
                Category,
                Image,
                Id
            ]);

            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error updating event:", error);
            return { success: false, error: error.message };
        }
    }

    async EventsDelete(Id) {
        const query = `DELETE FROM events WHERE Id = ?`;

        try {
            const [result] = await this.dbPromise.query(query, [Id]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error deleting event:", error);
            return { success: false, error: error.message };
        }
    }

    async EventsRead(search = "") {
        try {
            let query = `
            SELECT Id, Name, DateTime, Location, Description, GoogleFormLink, Participants, Category, Image
            FROM events
        `;
            let values = [];

            if (search && search.trim() !== "") {
                query += ` WHERE Name LIKE ? OR Location LIKE ? OR Description LIKE ? OR Category LIKE ?`;
                const searchTerm = `%${search}%`;
                values.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }

            const [rows] = await this.dbPromise.query(query, values);

            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading events:", error);
            return { success: false, error: error.message, data: [] };
        }
    }


    //============== Event===================
    //======================Account============
    //================ Faculty Bank Details ==================

// INSERT Faculty Bank Details
    async FacultyBankInsert(
        facultyId,                 // faculty.Id
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber
    ) {
        const query = `
        INSERT INTO faculty_bank_details
        (
            faculty_id,
            account_holder_name,
            bank_name,
            account_number,
            ifsc_code,
            account_type,
            salary_type,
            salary_amount,
            pan_number
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                facultyId,
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                accountType,
                salaryType,
                salaryAmount,
                panNumber
            ]);

            return { success: true, id: result.insertId };
        } catch (error) {
            console.error("Error inserting faculty bank details:", error);
            return { success: false, error: error.message };
        }
    }

// READ Faculty Bank Details by Faculty ID
    async FacultyBankReadByFacultyId(facultyId) {
        const query = `
        SELECT 
            f.Id AS FacultyId,
            f.Name AS FacultyName,
            b.account_holder_name,
            b.bank_name,
            b.account_number,
            b.ifsc_code,
            b.account_type,
            b.salary_type,
            b.salary_amount,
            b.pan_number
        FROM faculty f
        LEFT JOIN faculty_bank_details b
            ON f.Id = b.faculty_id
        WHERE f.Id = ?
    `;

        try {
            const [rows] = await this.dbPromise.query(query, [facultyId]);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error reading faculty bank details:", error);
            return { success: false, error: error.message };
        }
    }

// UPDATE Faculty Bank Details
    async FacultyBankUpdate(
        facultyId,
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        salaryType,
        salaryAmount,
        panNumber
    ) {
        const query = `
        UPDATE faculty_bank_details
        SET
            account_holder_name = ?,
            bank_name = ?,
            account_number = ?,
            ifsc_code = ?,
            account_type = ?,
            salary_type = ?,
            salary_amount = ?,
            pan_number = ?
        WHERE faculty_id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                accountHolderName,
                bankName,
                accountNumber,
                ifscCode,
                accountType,
                salaryType,
                salaryAmount,
                panNumber,
                facultyId
            ]);

            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error updating faculty bank details:", error);
            return { success: false, error: error.message };
        }
    }

// DELETE Faculty Bank Details
    async FacultyBankDelete(facultyId) {
        const query = `
        DELETE FROM faculty_bank_details
        WHERE faculty_id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [facultyId]);
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error("Error deleting faculty bank details:", error);
            return { success: false, error: error.message };
        }
    }

//================ Faculty Bank Details ==================

    //================Registration===========
    async RegistrationInsert(DocId, Profile, Name, UserType, Mobile, Qualification) {
        const query = `
            INSERT INTO Registration (DocId, Profile, Name, UserType, Mobile, Qualification)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        try {
            const [result] = await this.dbPromise.query(query, [
                DocId,
                Profile,
                Name,
                UserType,
                Mobile,
                Qualification
            ]);

            console.log('--- Registration Insert Result ---');
            console.log(result);

            return { success: true, id: result.insertId };
        } catch (error) {
            console.error('Error inserting registration:', error);
            return { success: false, error: error.message };
        }
    }

    async RegistrationUpdate(Id,  Profile, Name,  Mobile, Qualification) {
        const query = `
            UPDATE Registration
            SET 
                Profile = ?, 
                Name = ?, 
                Mobile = ?, 
                Qualification = ?
            WHERE Id = ?
        `;

        try {
            const [result] = await this.dbPromise.query(query, [
                Profile,
                Name,
                Mobile,
                Qualification,
                Id
            ]);

            console.log('--- Registration Update Result ---');
            console.log(result);

            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error('Error updating registration:', error);
            return { success: false, error: error.message };
        }
    }

    async RegistrationRead(docId) {
        let query = `
            SELECT *
            FROM Registration Where DocId=?
        `;
        try {
            const [rows] = await this.dbPromise.query(query, [docId]);

            console.log('--- Registration Read Result ---');
            console.log(rows);

            return { success: true, data: rows };
        } catch (error) {
            console.error('Error reading registrations:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
    // Student count + latest 5 students (single query)
    async StudentDashboardDataSingleQuery() {
        try {
            const query = `
            SELECT
                (SELECT COUNT(*) 
                 FROM registration 
                 WHERE UserType = 'student') AS total_students,
                r.DocId,
                r.Name,
                r.Mobile,
                r.Qualification
            FROM registration r
            WHERE r.UserType = 'student'
            ORDER BY r.id DESC
            LIMIT 5
        `;

            const [rows] = await this.dbPromise.query(query);

            return {
                success: true,
                total_students: rows.length > 0 ? rows[0].total_students : 0,
                students: rows.map(row => ({
                    DocId: row.DocId,
                    Name: row.Name,
                    Mobile: row.Mobile,
                    Qualification: row.Qualification
                }))
            };

        } catch (error) {
            console.error('❌ Error in StudentDashboardDataSingleQuery:', error);
            throw error;
        }
    }
    async GetEnrolledStudentsNotAllocated() {
        const query = `
        SELECT 
            r.Id AS StudentId,
            r.Name AS StudentName,
            r.Profile,
            r.Mobile,
            c.Id AS CourseId,
            c.Name AS CourseName
        FROM fees f
        INNER JOIN registration r 
            ON r.Id = f.StudentId
        INNER JOIN course c 
            ON c.Id = f.CourseId
        WHERE NOT EXISTS (
            SELECT 1
            FROM batchtimeallocated b
            WHERE b.STUDENTID = f.StudentId
              AND b.COURSEID = f.CourseId
        );
    `;

        try {
            const [rows] = await this.dbPromise.query(query);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error fetching enrolled students:", error);
            return { success: false, error: error.message };
        }
    }


    async GetEnrolledStudentsAllocated() {
        const query = `
        SELECT 
            r.Id AS StudentId,
            r.Name AS StudentName,
            r.Profile,
            r.Mobile,

            c.Id AS CourseId,
            c.Name AS CourseName,

            IFNULL(b.COURSECOMPLETED, 'NO') AS CourseCompleted,
            IFNULL(b.CERTIFICATEISSUED, 'NO') AS CertificateGenerated,
            b.CODATE,
            b.CERDATE,
            bt.StartTime,
            bt.EndTime,
            bt.ID AS BatchId

        FROM fees f
        INNER JOIN registration r 
            ON r.Id = f.StudentId
        INNER JOIN course c 
            ON c.Id = f.CourseId
        INNER JOIN batchtimeallocated b
            ON b.STUDENTID = f.StudentId
           AND b.COURSEID = f.CourseId
        INNER JOIN batchtime bt ON bt.Id=b.BATCHID
    `;

        try {
            const [rows] = await this.dbPromise.query(query);
            return { success: true, data: rows };
        } catch (error) {
            console.error("Error fetching allocated students:", error);
            return { success: false, error: error.message };
        }
    }



    //========================Registration=====================================
//========================Batchtime=======================================
    async BatchTimeAllocatedInsert(
        STUDENTID,
        COURSEID,
        BATCHID,
        COURSECOMPLETED = "NO",
        CERTIFICATEISSUED = "NO",
        CODATE = null,
        CERDATE = null
    ) {
        const query = `
        INSERT INTO batchtimeallocated
        (
            STUDENTID,
            COURSEID,
            BATCHID,
            COURSECOMPLETED,
            CERTIFICATEISSUED,
            CODATE,
            CERDATE
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            // Enforce business rules
            if (COURSECOMPLETED !== "YES") {
                COURSECOMPLETED = "NO";
                CODATE = null;
            }

            if (COURSECOMPLETED !== "YES") {
                CERTIFICATEISSUED = "NO";
                CERDATE = null;
            }

            const [result] = await this.dbPromise.query(query, [
                String(STUDENTID),
                String(COURSEID),
                String(BATCHID),
                COURSECOMPLETED,
                CERTIFICATEISSUED,
                CODATE,
                CERDATE
            ]);

            return {
                success: true,
                id: result.insertId,
                message: "Batch time allocation created successfully"
            };

        } catch (error) {
            console.error("Error inserting into batchtimeallocated:", error);
            return {
                success: false,
                message: "Failed to allocate batch time",
                error: error.message
            };
        }
    }
    async UpdateStudentBatch(STUDENTID, COURSEID, BATCHID) {
        const query = `
        UPDATE batchtimeallocated
        SET
            BATCHID = ?
        WHERE
            STUDENTID = ?
            AND COURSEID = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                BATCHID,
                STUDENTID,
                COURSEID
            ]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "No matching student-course record found"
                };
            }

            return { success: true };

        } catch (error) {
            console.error("Error updating student batch:", error);
            return { success: false, error: error.message };
        }
    }

    async UpdateCourseCompletion(STUDENTID, COURSEID) {
        const query = `
        UPDATE batchtimeallocated
        SET
            COURSECOMPLETED = 'YES',
            CODATE = NOW()
        WHERE
            STUDENTID = ?
            AND COURSEID = ?
            AND (COURSECOMPLETED = 'NO' OR COURSECOMPLETED IS NULL)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                STUDENTID,
                COURSEID
            ]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "Course already completed or record not found"
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Error updating course completion:", error);
            return { success: false, error: error.message };
        }
    }

    async UpdateCertificateIssue(STUDENTID, COURSEID) {
        const query = `
        UPDATE batchtimeallocated
        SET
            CERTIFICATEISSUED = 'YES',
            CERDATE = NOW()
        WHERE
            STUDENTID = ?
            AND COURSEID = ?
            AND COURSECOMPLETED = 'YES'
            AND (CERTIFICATEISSUED = 'NO' OR CERTIFICATEISSUED IS NULL)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                STUDENTID,
                COURSEID
            ]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "Certificate already issued or course not completed"
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Error updating certificate issue:", error);
            return { success: false, error: error.message };
        }
    }

    async BatchTimeInsert(Title, StartTime, EndTime, InstructorId, CourseId) {
        const query = `
        INSERT INTO batchtime (Title, StartTime, EndTime, InstructorId, CourseId)
        VALUES (?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                Title,
                StartTime,
                EndTime,
                InstructorId,
                CourseId
            ]);

            return { success: true, id: result.insertId };
        } catch (error) {
            console.error("Error inserting batch time:", error);
            return { success: false, error: error.message };
        }
    }
    async BatchTimeUpdate(Id, Title, StartTime, EndTime, InstructorId, CourseId) {
        const query = `
        UPDATE batchtime
        SET Title = ?, StartTime = ?, EndTime = ?, InstructorId = ?, CourseId = ?
        WHERE Id = ?
    `;

        try {
            const [result] = await this.dbPromise.query(query, [
                Title,
                StartTime,
                EndTime,
                InstructorId,
                CourseId,
                Id
            ]);

            if (result.affectedRows === 0) {
                return { success: false, message: "No batch found with given ID" };
            }

            return { success: true };
        } catch (error) {
            console.error("Error updating batch time:", error);
            return { success: false, error: error.message };
        }
    }
    async BatchTimeDelete(Id) {
        const query = `DELETE FROM batchtime WHERE Id = ?`;

        try {
            const [result] = await this.dbPromise.query(query, [Id]);

            if (result.affectedRows === 0) {
                return { success: false, message: "No batch found with given ID" };
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting batch time:", error);
            return { success: false, error: error.message };
        }
    }
    async BatchTimeRead(search = "") {
        try {
            let query = `
      SELECT 
          b.Id AS BatchId,
          b.Title AS BatchTitle,
          b.StartTime,
          b.EndTime,

          c.Id AS CourseId,
          c.Name AS CourseName,
          c.Description AS CourseDescription,
          c.Fees,
          c.Sylabus,
          c.Duration AS CourseDuration,
          c.Image AS CourseImage,

          f.Id AS FacultyId,
          f.Name AS FacultyName,
          f.Mobile AS FacultyMobile,
          f.Address AS FacultyAddress,
          f.Email AS FacultyEmail,
          f.Courses AS FacultyCourses,
          f.Image AS FacultyImage

      FROM BatchTime b
      JOIN course c ON b.CourseId = c.Id
      JOIN faculty f ON b.InstructorId = f.Id
    `;

            // ✅ Add search filter if user provides it
            if (search) {
                query += `
        WHERE f.Name LIKE ? 
        OR c.Name LIKE ? 
        OR b.Title LIKE ?
      `;
            }


            const [rows] = await this.dbPromise.query(query, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []);

            return rows;
        } catch (error) {
            console.error("❌ Database Error in BatchTimeRead:", error);
            throw error;
        }
    }
    async BatchTimeReadByCourseId(CourseId) {
        const query = `
        SELECT
            Id AS BatchId,
            Title AS BatchTitle,
            StartTime,
            EndTime,
            InstructorId,
            CourseId
        FROM batchtime
        WHERE CourseId = ?
        ORDER BY StartTime
    `;

        try {
            const [rows] = await this.dbPromise.query(query, [CourseId]);
            return rows;
        } catch (error) {
            console.error("❌ Database Error in BatchTimeReadByCourseId:", error);
            throw error;
        }
    }



//========================BatchTime=======================
//========================Read Faculty Course===========
    async ReadCourseForFaculty(InstructorId){
        try{
            let query=`SELECT 
    bt.Id AS BatchId,
    bt.Title,
    bt.StartTime,
    bt.EndTime,
    bt.InstructorId,
    c.Id AS CourseId,
    c.Name AS CourseName,
    c.Description,
    c.Fees,
    c.Sylabus,
    c.Duration,
    c.Image
FROM onlineeducation.batchtime bt
INNER JOIN onlineeducation.course c
    ON bt.CourseId = c.Id
WHERE bt.InstructorId = (select faculty.id from faculty where FacultyId=?)
  AND bt.EndTime > CURRENT_DATE();

`;

            const [rows] = await this.dbPromise.query(query, [InstructorId]);

            return rows;

        }catch(e){}
    }

    async test(){
        console.log("test");
    }
}

module.exports = new Database();
