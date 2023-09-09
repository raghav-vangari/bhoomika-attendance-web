export interface Attendance {
    id?: string,
    attendanceDate: string,
    studentId: string,
    studentName: string,
    status: string,
    toggle?: boolean,
    attendingTime?: string,
    submitted?: boolean,
    toSubmit?: boolean
}