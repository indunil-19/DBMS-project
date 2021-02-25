const db = require("../connection");

class Supervisor {
  // get all leaving requests
  static async findEmployee(id){
    const user =await db.query(`
    select * from supervisor left join personal_information on personal_information.employee_id=supervisor.supervisor_id where personal_information.employee_id = $1`, [id])
    return user.rows[0];
  }

  static async getAllLeavingRequests() {
    const id = 11;
    const no = "No";
    const records = (await db.query(` select * from getleavea($1) `, [id]))
      .rows;
    console.log(records);
    return records;
  }

  // get leaving requests count
  static async getLeavingRequestCount() {
    const id = 11;
    const count = (await db.query(` select count(*) from getleavea($1) `, [id]))
      .rows;
    return count;
  }

  // find leave request using leave_id
  static async findByID(leave_id) {
    const request = (
      await db.query(
        `
            select * from leave_record where leave_id = $1`,
        [leave_id]
      )
    ).rows;
    return request;
  }

  // get all leaving requests which are requested by each employee
  static async getRemainingLeaves(employee_id) {
    const res = (
      await db.query(
        `
            select * from employee_leave WHERE employee_id = $1 AND year = 2021`,
        [employee_id]
      )
    ).rows;
    return res;
  }

  // approve leave request
  static async approveLeave({ leave_id, approved }) {
    let result = "Yes";
    if (approved == null) {
      result = "Ignored";
      console.log("approved");
    }
    const res = (
      await db.query(
        `
            UPDATE leave_record SET approval_state = $1 WHERE leave_id = $2`,
        [result, leave_id]
      )
    ).rows;
    return res;
  }

  // get all employees
  static async getEmployees() {
    const id = 11;
    const res = (
      await db.query(
        `
            select * from getEmployees($1)`,
        [id]
      )
    ).rows;
    for (var i = 0; i < res.length; i++) {
      let pres = (res[i].count_leaves / res[i].total_leaves) * 100;
      res[i].total_leaves = Math.round(pres);
    }
    return res;
  }

  // get employees count
  static async getEmployees_Count() {
    const id = 11;
    const emp_count = (
      await db.query(
        `
            select count(*) from getEmployees($1)`,
        [id]
      )
    ).rows;
    return emp_count;
  }
  // find employee using employee_id
  static async findemployee(employee_id) {
    const res = (
      await db.query(
        `
            select * from getEmployee($1)`,
        [employee_id]
      )
    ).rows;
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      let pres = (res[i].count_leaves / res[i].total_leaves) * 100;
      res[i].total_leaves = Math.round(pres);
    }
    return res;
  }

  // get attendance
  static async countAttendance() {
    const supervisor_id = 11;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    console.log(date - 1);
    // console.log(year + "-" + month + "-" + date);
    const today = year + "-" + month + "-" + date;
    console.log("gfgf")
    const res = (
      await db.query(`select * from getAttendence($1,$2)`, [
        supervisor_id,
        today,
      ])
    ).rows;
     console.log("gfgf")
    console.log(res);
    return res;
  }

  static async countWeeklyAttendance() {
    const supervisor_id = 11;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let arr = [];
    if (date <= 5) {
      
      const lim = date;
      console.log(lim);
      for (var i = 0; i < lim; i++) {
        let date1 = date - i;
        let today = year + "-" + month + "-" + date1;
        let res = (
          await db.query(`select * from getAttendence($1,$2)`, [
            supervisor_id,
            today,
          ])
        ).rows;
        arr.push({ val: res, date: month + "/" + date1 });
      }
    } else {
      console.log(date);
      for (var i = 0; i < 5; i++) {
        let date1 = date - i;
        let today = year + "-" + month + "-" + date1;
        let res = (
          await db.query(`select * from getAttendence($1,$2)`, [
            supervisor_id,
            today,
          ])
        ).rows;
        arr.push({ val: res, date: month + "/" + date1 });
      }
    }

    console.log(arr);
    return arr;
  }
}

module.exports = Supervisor;
