export interface Attendance {
    id?: string,
    attendanceDate: string,
    studentId: number,
    studentName: string,
    status: string,
    toggle?: boolean,
    attendingTime?: string,
    submitted?: boolean,
    toSubmit?: boolean,
    batch?: number
}