import React, { Component } from 'react';
import image from './flight.jpg';

//Import components
import Seating from './Seating.js';

//Import Designs
import {Container,Grid,Card,CardMedia,Typography,TextField,FormControl,Alert} from '@mui/material';

//Create a component to show form
class Booking extends Component{    

    constructor(props){
        super(props); 
        this.state = {seating: "[[3,2], [4,3], [2,3], [3,4]]",passenger:30,error:0};
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    
    handleSeating = externalId => (event) => { 
        let seating = event.target.value;
        let check_json = this.IsJsonString(seating);
       
        this.setState({seating : seating});

        if(!check_json)
            this.setState({error : 1}); 
        else   
            this.setState({error : 0});  
    }

    handlePassenger = externalId => (event) => { 
        this.setState({passenger : event.target.value}); 
    }

    render(){	
        const seat = this.state;
        return (
            <Container maxWidth="false">
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardMedia className="airplane_header_img" image={image}  component="img" height="60%"/>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography className="airplane_h4" variant="h4" align="center">Airplane Seat Booking</Typography>
                    </Grid>

                    <Grid container direction="row" justifyContent="center">
                        <Grid item xs={7}>
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <TextField id="seating-arrangement" label="Seating Arrangement" value={this.state.seating} variant="standard" onChange={this.handleSeating()} />
                                <Typography>Example seating arrangement: [[3,2], [4,3], [2,3], [3,4]]</Typography>
                                {this.state.error === 1 &&
                                    <Alert severity="error">Please check the seating value</Alert>
                                }
                            </FormControl>
                        </Grid>

                        <Grid item xs={7}>
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <TextField type="number" id="passenger" label="Passenger" value={this.state.passenger} variant="standard" onChange={this.handlePassenger()} />
                            </FormControl>
                        </Grid>
                   </Grid>
                </Grid>
                {this.state.error === 0 &&
                    <Seating {...seat} />
                }
            </Container>
        )
    }
}

export default Booking;
