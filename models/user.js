const sql = require('../connection');
const con=require('../connection');
const { use } = require('../routes');


class User{
    
    
    static async findUser(id){
            
            const [user] =await sql`
            select * from personal_information where employee_id = ${id}`
            return user;
           
    }


    static async findUserByNIC(NIC){

            const [user] =await sql`
            select * from personal_information where NIC= ${NIC}`
            return user;
   
      }

      static async findUserByEmail(email){
            const [user] =await sql`
            select * from personal_information where email= ${email}`
            return user

      }
      static async findEmployee(id){
            const [user] =await sql`
            select * from personal_information left outer join employee using(employee_id) where employee_id = ${id}`
            return user;
      }


}

module.exports=User