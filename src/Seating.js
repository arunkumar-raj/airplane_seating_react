import React, { Component } from 'react';


//Import Designs
import {Container,Table,TableBody,TableCell,TableHead,TableRow} from '@mui/material';
var counter = 0;
var seat_allocation =  {};
//Create a component to Create Seating
class Seating extends Component{    

    constructor(props){
        super(props); 
        this.state = {max_column:0,seating_array_length:0};
    }

    componentDidMount = () =>{
        let seating = this.props.seating;
        let seating_array = JSON.parse(seating);
        let maxVal = '';
        if(Array.isArray(seating_array)){
            maxVal= seating_array.reduce((acc, seat) => acc = acc > seat[1] ? acc : seat[1], 0);   

        }
        this.setState({max_column:maxVal,seating_array_length:seating_array.length});
    }
    //To Parse array as object
    convertArrayToObject = (array) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
          return {
            ...obj,
            [item]: item,
          };
        }, initialValue);
    }

    //Check for object Key
    containsObject(obj, list) {
        return obj.hasOwnProperty(list);
    }

    Get_Seating_Arrangements = () => {
        
        let seating = this.props.seating;
        let seating_array = JSON.parse(seating);
        var align_seat =  {};

        //Check is array seating value
        if(Array.isArray(seating_array)){

            //Get MAX column value to loop columns
            let maxVal= this.state.max_column;
            if(maxVal === 0){
                return '';
            }
     
            //Based on dimension rows will be there
            let row_index=0;

            //Looping Two dimensional array / Input Value
            for(let args=0; args < seating_array.length; args++){

                //Split Array index in to variables
                let [row, column] = seating_array[args];

                //Create an array by row values
                //[3,2] row is 3 create array(0,1,2)
                //Convert row values in to object
                let create_row_arr = Array.from({length: row}, (x, i) => i);
                let convert_json_row = this.convertArrayToObject(create_row_arr);

                //Loop Again using max column 
                for(let cols=1; cols <= maxVal; cols++){
                    
                    //Add object value
                    let column_key = 'column_'+cols;
                    let check_key_column = this.containsObject(align_seat,column_key);

                    //Check for key if not created then create object
                    if(!check_key_column){
                        align_seat[column_key] = {};
                    }

                    let row_key = 'row_'+row_index;    
                    if(cols <= column){     
                        align_seat[column_key][row_key] = convert_json_row;
                    }
                    else{
                        align_seat[column_key][row_key] =null;
                    }

                }
                row_index++;
            }
            
        }

        if(!this.containsObject(seat_allocation)){
            this.Allocate_seats(align_seat);
        }

        return seat_allocation;  
        
    }


    
    Allocate_seats = (align_seat) => {
        if(align_seat){
           let seat_length =Object.keys(align_seat).length;
           if(seat_length > 0){
                //Created_Aisle seats
                this.Allocate_aisle_seats(align_seat);
                this.Allocate_window_seats(align_seat);
                this.Allocate_middle_seats(align_seat);
           }
        }
    }

    
    Allocate_aisle_seats = (align_seat) => {
        let passenger = this.props.passenger;
        let row_key = '';
        let first_row_key = '';
        let last_row_key = '';
        let aisle_counter = 0;
        
        //Assign aisle seats
        Object.values(align_seat).map((row_value,key) => {
            let colum_key_create = (key + 1);
            let column_key = 'column_'+colum_key_create;
            
            //Add object value
            let check_key_column = this.containsObject(seat_allocation,column_key);

            //Check for key if not created then create object
            if(!check_key_column){
                seat_allocation[column_key] = {};
            }

            //Get First and Last row in a column
            let first_column_key = Object.keys(row_value)[0];                    
            let last_column_key = Object.keys(row_value)[Object.keys(row_value).length-1];
            
            
            Object.values(row_value).map((row,row_index) => {

                row_key = 'row_'+row_index;  
                seat_allocation[column_key][row_key] ={}

                if(row != null){
                    //Get row keys to find first and last seat
                    first_row_key = Object.keys(row)[0];
                    last_row_key = Object.keys(row)[Object.keys(row).length-1];
                    if(row_value[row_key]){
                        
                        switch(row_key){
                            //First column last seat
                            case first_column_key:
                                if(aisle_counter < passenger){
                                    aisle_counter ++;
                                    seat_allocation[column_key][first_column_key][last_row_key]= {seatnumber:aisle_counter,type:'aisle'};
                                } 
                                else{
                                    seat_allocation[column_key][first_column_key][last_row_key]= {seatnumber:'empty',type:'aisle'};
                                }
                            break;
                            //Last column first seat
                            case last_column_key:
                                if(aisle_counter < passenger){
                                    aisle_counter ++;
                                    seat_allocation[column_key][last_column_key][first_row_key]= {seatnumber:aisle_counter,type:'aisle'};
                                } 
                                else{
                                    seat_allocation[column_key][last_column_key][first_row_key]= {seatnumber:'empty',type:'aisle'};
                                }
                            break;
                            //intermediate seat with row ends
                            default:
                                if(aisle_counter < passenger){
                                    aisle_counter ++;
                                    seat_allocation[column_key][row_key][first_row_key]= {seatnumber:aisle_counter,type:'aisle'};
                                    if(aisle_counter < passenger){
                                        aisle_counter ++;
                                        seat_allocation[column_key][row_key][last_row_key]= {seatnumber:aisle_counter,type:'aisle'};
                                    }else{
                                        seat_allocation[column_key][row_key][last_row_key]= {seatnumber:'empty',type:'aisle'};
                                    }
                                } 
                                else{
                                    seat_allocation[column_key][row_key][first_row_key]= {seatnumber:'empty',type:'aisle'}; 
                                }
                            break;
                        }
                    }
                }
                return row_value;
            });
            return row_value;
        });
        counter = aisle_counter;
    }

    Allocate_window_seats= (align_seat) => {
        let passenger = this.props.passenger;
        let row_key = '';
        let first_row_key = '';
        let last_row_key = '';
        let window_counter = counter;

        //Assign window seats
        Object.values(align_seat).map((row_value,key) => {
            let colum_key_create = (key + 1);
            let column_key = 'column_'+colum_key_create;
            
            //Add object value
            let check_key_column = this.containsObject(seat_allocation,column_key);

            //Check for key if not created then create object
            if(!check_key_column){
                seat_allocation[column_key] = {};
            }

            //Get First and Last row in a column
            let first_column_key = Object.keys(row_value)[0];                    
            let last_column_key = Object.keys(row_value)[Object.keys(row_value).length-1];
            
            
            Object.values(row_value).map((row,row_index) => {
                row_key = 'row_'+row_index;  
                if(row != null){
                    //Get row keys to find first and last seat
                    first_row_key = Object.keys(row)[0];
                    last_row_key = Object.keys(row)[Object.keys(row).length-1];
                    if(row_value[row_key]){
                        
                         switch(row_key){
                             //First column and first seat
                            case first_column_key:
                                if(window_counter < passenger){
                                    window_counter ++;
                                    seat_allocation[column_key][first_column_key][first_row_key]= {seatnumber:window_counter,type:'window'};
                                } 
                                else{
                                    seat_allocation[column_key][first_column_key][first_row_key]= {seatnumber:'empty',type:'window'};
                                }
                            break;
                            //last column and last seat
                            case last_column_key:
                                if(window_counter < passenger){
                                    window_counter ++;
                                    seat_allocation[column_key][last_column_key][last_row_key] = {seatnumber:window_counter,type:'window'};
                                } 
                                else{
                                    seat_allocation[column_key][last_column_key][last_row_key] = {seatnumber:'empty',type:'window'};
                                }
                            break;
                            default:
                            break;
 
                        } 
                    }
                }
                return row_value;
            });
            return row_value;
        });
        counter = window_counter;
    }

    Allocate_middle_seats= (align_seat) => {
        let passenger = this.props.passenger;
        let row_key = '';
        let first_row_key = '';
        let last_row_key = '';
        let middle_counter = counter;
        //Assign middle seats
        Object.values(align_seat).map((row_value,key) => {
            let colum_key_create = (key + 1);
            let column_key = 'column_'+colum_key_create;
            
            //Add object value
            let check_key_column = this.containsObject(seat_allocation,column_key);

            //Check for key if not created then create object
            if(!check_key_column){
                seat_allocation[column_key] = {};
            }

            Object.values(row_value).map((row,row_index) => {
                row_key = 'row_'+row_index;  
                if(row !== null){
                    first_row_key = Object.keys(row)[0];
                    last_row_key = Object.keys(row)[Object.keys(row).length-1];
                    if(row_value[row_key]){
                        //Get all rows and fill remaining seats as middle 
                        Object.values(row).map((val,index) => {
                            if(index != first_row_key && index != last_row_key){
                                if(middle_counter < passenger){
                                    middle_counter ++;
                                    seat_allocation[column_key][row_key][index]= {seatnumber:middle_counter,type:'middle'};
                                }else{
                                    seat_allocation[column_key][row_key][index]= {seatnumber:'empty',type:'middle'};
                                }
                            }
                            return row;
                        });

                    }
                }
                return row_value;
            });
            return row_value;
        });
        counter = middle_counter;
    }


    isObject= (obj) => {
        return obj !== undefined && obj !== null && obj.constructor == Object;
    }

    render(){	
        if(this.state.max_column!==0){
            let flight = this.Get_Seating_Arrangements();
            let seating = this.props.seating;
            let seating_array = JSON.parse(seating);
            
            return (
                <Container maxWidth="false" className="airplane_table">
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                {
                                    Object.keys(seating_array).map((key,val) =>
                                        <TableCell key={key} align="center">{'Column '+ key}</TableCell>
                                    )
                                }
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                Object.values(flight).map((row_value,key) =>
                                    <TableRow key={key}>
                                        {
                                            Object.values(row_value).map((row,rowkey) =>
                                                <TableCell key={rowkey} align="center">
                                                    {
                                                        Object.values(row).map((value,rkey) =>
                                                        <div className={"aero_seats "+value.type}>{(value.seatnumber != 'empty')?value.seatnumber:'X'}</div>
                                                        )
                                                    }
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                )
                            }
                        
                        </TableBody>
                    </Table>
                </Container>
            )
        }else{
            return '';
        }
    }
}

export default Seating;
