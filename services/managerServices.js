const manager=require('../models/manager');
const Error = require("../helpers/error");
const bcrypt = require("bcrypt");

class managerServices{
    static async getAllBranches(){
        const branches=await manager.getAllBranches();
        return branches;
    }
    static async getAllJobTitles(){
        const Jobtypes=await manager.getAllJobTitles();
        return Jobtypes;
    }
    static async getAllDepartments(){
        const departments=await manager.getAllDepartments();
        return departments;
    }
    static async getEmployeeList(branch,department,jobtype,user){
        var querySelect=1;//default
        if(department == 'allDepartments' && jobtype == 'allJobtypes'){
            querySelect=1;
        }
        else if(department == 'allDepartments'){
            querySelect=2;
        }
        else if(jobtype == 'allJobtypes'){ 
            querySelect=3;
        }
        else{
            querySelect=4;
        }
        const employeeList=await manager.getEmployees(branch,department,jobtype,user,querySelect);
        // console.log(employeeList);
        return employeeList;
    }
    static async getCanbeSupervisors(branch,department,user){
        const canbeSupervisor=await manager.getCanbeSupervisors(branch,department,user);
        return canbeSupervisor;
    }
    static async getSupervisorGroup(supervisor_id){
        const supervisor_employees=await manager.getSupervisorGroup(supervisor_id);
        return supervisor_employees;
    }
    static async addToSupervisorTable({supervisor_id}){
        const supervisor_employees=await manager.addToSupervisorTable(supervisor_id);
        return supervisor_employees;
    }
    static async getEmployeesToaddSupervisorT(branch,department,user){
        const toAddSupervisor_employees=await manager.getEmployeesToaddSupervisorT(branch,department,user);
        return toAddSupervisor_employees;
    }
    static async saveSupervisorGroup(supervisor_id,supervisorGroup){
        await manager.saveSupervisor(supervisor_id);// supervisor true
        const supervisorGroupemployeeIDs=[];
        for (var i = 0; i < supervisorGroup.length; i++) {
            const employee_id=supervisorGroup[i].employee_id;
            supervisorGroupemployeeIDs.push(employee_id);
        }
        // console.log(supervisorGroupemployeeIDs);
        const arraylength = supervisorGroupemployeeIDs.length;
        await manager.saveSupervisorGroup(supervisor_id,supervisorGroupemployeeIDs,arraylength);
        // return toAddSupervisor_employees;
    }
    static async getSupervisorList(branch,department,user){
        const SupervisorList=await manager.getSupervisors(branch,department,user);
        return SupervisorList;
    }
    static async findSupervisor(emp_id){
        var result=await manager.getSupervisor(emp_id);
        return result;
    }
    static async SupervisorDelete({employee_id}){
        var result=await manager.SupervisorDelete(employee_id);
        return result;
    }

// -------------------------------------------------view data edit data --------------------
static async getAllPayGradeLevel(){
    const payGrade=await manager.getAllPayGradeLevel();
    return payGrade;
}
static async getEmployeeStatus(){
    const employee_status=await manager.getEmployeeStatus();
    return employee_status; 
}
static async checkEmp(id,user,userBranch,userDepartment){
    const result=await manager.getEmployeeBranchAndDeptAndjobTitle(id);
    // console.log(result);
    if(result.length===0){
        throw new Error.BadRequest("Invalid ID");
    }
    const [{branch_name,dept_name,job_title}] = result;
    
    if(job_title===user){
        throw new Error.BadRequest("No access to view or edit this employee's data");
    } 

    if(user === "Manager"){
        if(userBranch!==branch_name){
            throw new Error.BadRequest("This emplooyee is not in your branch");
        }
        else if(userDepartment!== dept_name){
            throw new Error.BadRequest("This emplooyee is not in your department");
        }
    }
}
static async getEmpDATA(id){
    const result=await manager.getEmpDATA(id);
    return result; 
}
static async updateEmployee({
    ID,
    NIC,
    email,
    first_name,
    middle_name,
    last_name,
    phone,
    gender,
    birthday,
    address_id,
    city,
    postal_code,
    password,
    repassword,
    branch,
    jobTitle,
    department,
    payGrade,
    empStatus,
    salary,
  }) {
    const checkEmail = await manager.findUserIDByEmail(email);
    console.log(checkEmail)
    ID= parseInt(ID);
    console.log(ID)
    if (checkEmail.length>0 && checkEmail[0].employee_id !==ID) {
      throw new Error.BadRequest(`This email is already registered with employee id ${checkEmail[0].employee_id}`);
    }
    const checkNIC = await manager.findUserIDByNIC(NIC);
    console.log(checkNIC)
    if (checkNIC.length>0 && checkNIC[0].employee_id !==ID) {
      throw new Error.BadRequest(`This NIC is already registered with employee id ${checkNIC[0].employee_id}`);
    }
    const hashpwd = await bcrypt.hash(password, 10);
    const result = await manager.updateEmployee(
      ID,
      NIC,
      email,
      first_name,
      middle_name,
      last_name,
      phone,
      gender,
      birthday,
      address_id,
      city,
      postal_code,
      hashpwd,
      branch,
      jobTitle,
      department,
      payGrade,
      empStatus,
      salary
    );
    return result;
  }


}
module.exports=managerServices;