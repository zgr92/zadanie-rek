import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import tshirtFrontImg from './tshirt-front.jpg';
import tshirtBackImg from './tshirt-back.jpg';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function TshirtImage(props) {
  const TshirtImage = styled.div`
    position: absolute;
    z-index: 2;
    width: 50px;
    height: 50px;
    top: 57px;
    left: 72px;
    background-image: url(${props.url});
    background-position: center center;
    background-size: contain;
  `
  return (
    <TshirtImage />
  );
}

function OrderSteps() {
  const getRandom = () => {return Math.floor(Math.random() * 100)};
  const getImgBySeed = (seed) => {return `https://picsum.photos/seed/${seed}/200/200`};
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    printPosition: {
      front: false,
      back: false,
    },
    imageUrl: getImgBySeed(getRandom()),
    customerData: {
      name: '',
      surname: '',
      street: '',
      houseNumber: '',
      flatNumber: '',
      zipCode: '',
      city: '',
      phone: '',
      email: '',
    },
    price: 0,
  });

  const onPrintPositionChange = (printPosition) => {
    let price = 0;
    if (printPosition.front === true) {
      price += 10;
    }
    if (printPosition.back === true) {
      price += 10;
    }
    setOrderData((previousOrderData) => ({ ...previousOrderData, printPosition, price }));
  };

  const onCustomerDataChange = (customerData) => {
    setOrderData((previousOrderData) => ({ ...previousOrderData, customerData}));
  };

  const steps = ['Pozycja nadruku', 'Wybierz zdjęcie', 'Dane', 'Podsumowanie'];

  const onImageChange = () => {
    const imageUrl = getImgBySeed(getRandom());
    setOrderData((previousOrderData) => ({ ...previousOrderData, imageUrl}));
  };

  const setImageHandler = (imageUrl) => {
    setOrderData((previousOrderData) => ({ ...previousOrderData, imageUrl}));
  };
  
  const getStepContent = (step, orderData) => {
    switch (step) {
      case 0:
        return <CheckboxesGroup printPosition={orderData.printPosition} onChange={onPrintPositionChange} imageUrl={orderData.imageUrl} />;
      case 1:
        return <ChoosePhoto imgUrl={orderData.imageUrl} onImageChange={onImageChange} setImage={setImageHandler} />;
      case 2:
        return <CustomerDataForm customerData={orderData.customerData} onChange={onCustomerDataChange} />;
      case 3:
        return <Summary orderData={orderData} />;
      default:
        return 'Unknown step';
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const TshirtPreview = styled.div`
    display: inline-block;
    position: relative;
    margin: 20px;
    width: 200px;
    height: 200px;
    background-image: url(${props => props.imgUrl});
    background-position: center center;
    background-size: contain;
  `

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
        <div>
          {activeStep === steps.length ? (
          <div>
              <h1>Dziękujemy za zamówienie!</h1>
              <OrderSummary orderData={orderData} />
              {orderData.printPosition.front === true ? (<TshirtPreview imgUrl={tshirtFrontImg}><TshirtImage url={orderData.imageUrl} /></TshirtPreview>) : ''}
              {orderData.printPosition.back === true ? (<TshirtPreview imgUrl={tshirtBackImg}><TshirtImage url={orderData.imageUrl} /></TshirtPreview>) : ''}
          </div>
        ) : (
            <div>
              {getStepContent(activeStep, orderData)}
              <div>
                <h2>Podgląd</h2>
                {orderData.printPosition.front === true ? (<TshirtPreview imgUrl={tshirtFrontImg}><TshirtImage url={orderData.imageUrl} /></TshirtPreview>) : ''}
                {orderData.printPosition.back === true ? (<TshirtPreview imgUrl={tshirtBackImg}><TshirtImage url={orderData.imageUrl} /></TshirtPreview>) : ''}
                <h3>Cena: {orderData.price}</h3>
              </div>
              <div>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Powrót
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Złóż zamówienie' : 'Dalej'}
                </Button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

function ChoosePhoto(props) {
  const [previousImg, setPreviousImg] = useState('');

  const ImgPreview = styled.div`
    display: inline-block;
    width: 200px;
    height: 200px;
    background-image: url(${props => props.imgUrl});
    background-position: center center;
    background-size: contain;
  `;

  const previousImageHandler = () => {
    setPreviousImg('');
    props.setImage(previousImg)
  };

  const nextImageHandler = () => {
    setPreviousImg(props.imgUrl);
    props.onImageChange();
  };

  return (
    <div>
      <h1>Wybierz zdjęcie</h1>
      <ImgPreview imgUrl={props.imgUrl} />
      {previousImg !== '' ? <Button onClick={previousImageHandler}>Poprzednie zdjęcie</Button> : ''}
      <Button onClick={nextImageHandler}>Następne zdjęcie</Button>
    </div>
  );
}

function CheckboxesGroup(props) {
  const [printPosition, setPrintPosition] = useState(props.printPosition);

  const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0;
    clip: rect(0 0 0 0);
    clippath: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `

  const TshirtCheckbox = styled.div`
    display: inline-block;
    position: relative;
    margin: 20px;
    width: 200px;
    height: 200px;
    background-image: url(${props => props.imgUrl});
    background-position: center center;
    background-size: contain;
    border-radius: 3px;
    transition: all 150ms;
    border: ${props => props.checked ? '3px solid blue' : '3px solid transparent'};
  `

  const handleChange = (event) => {
    const newPosition = { ...printPosition, [event.target.name]: event.target.checked };
    setPrintPosition(newPosition);
    props.onChange(newPosition);
  };

  const { front, back } = printPosition;
  const error = [front, back].filter((v) => v).length < 1;

  const labelPlacement = 'bottom';

  return (
    <div>
      <h1>Wybierz miejsce nadruku</h1>
      <form noValidate autoComplete="off">
        <FormControl required error={error} component="fieldset">
          <FormGroup row>
          <label>
            <div>
              <TshirtCheckbox checked={front} imgUrl={tshirtFrontImg}><TshirtImage url={props.imageUrl} /></TshirtCheckbox>
              <HiddenCheckbox
                name="front"
                type="checkbox"
                checked={front}
                onChange={handleChange} />
            </div>
              Przód
          </label>
          <label>
            <div>
              <TshirtCheckbox checked={back} imgUrl={tshirtBackImg}><TshirtImage url={props.imageUrl} /></TshirtCheckbox>
              <HiddenCheckbox
                name="back"
                type="checkbox"
                checked={back} 
                onChange={handleChange} />
              </div>
              Tył
          </label>
          </FormGroup>
          <FormHelperText>Wybierz co najmnniej jedno</FormHelperText>
        </FormControl>
      </form>
    </div>
  );
}

function CustomerDataForm(props) {
  const [ customerData, setCustomerData ] = useState(props.customerData);

  const handleChange = (event) => {
    const newCustomerData = { ...customerData, [event.target.name]: event.target.value };
    setCustomerData(newCustomerData);
    props.onChange(newCustomerData);
  };

  return (
    <div>
      <h1>Dane zamawiającego</h1>
      <form noValidate autoComplete="off">
        <FormGroup>
          <TextField onChange={handleChange} required name="name" label="Imię" variant="outlined" />
          <TextField onChange={handleChange} required name="surname" label="Nazwisko" variant="outlined" />
          <TextField onChange={handleChange} required name="street" label="Ulica" variant="outlined" />
          <TextField onChange={handleChange} required name="houseNumber" label="Numer budynku" variant="outlined" />
          <TextField onChange={handleChange} name="flatNumber" label="Numer mieszkania" variant="outlined" />
          <TextField onChange={handleChange} required name="zipCode" label="Kod pocztowy" variant="outlined" />
          <TextField onChange={handleChange} required name="city" label="Miasto" variant="outlined" />
          <TextField onChange={handleChange} name="phone" label="Telefon" variant="outlined" />
          <TextField onChange={handleChange} required name="email" label="Adres mailowy" variant="outlined" />
        </FormGroup>
      </form>
    </div>
  );
}

function OrderSummary(props) {
  const orderData = props.orderData;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow key="price">
            <TableCell component="th" scope="row">
              Cena
            </TableCell>
            <TableCell align="right">{orderData.price}</TableCell>
          </TableRow>
          <TableRow key="name">
            <TableCell component="th" scope="row">
              Imię
            </TableCell>
            <TableCell align="right">{orderData.customerData.name}</TableCell>
          </TableRow>
          <TableRow key="surname">
            <TableCell component="th" scope="row">
              Nazwisko
            </TableCell>
            <TableCell align="right">{orderData.customerData.surname}</TableCell>
          </TableRow>
          <TableRow key="street">
            <TableCell component="th" scope="row">
              Ulica
            </TableCell>
            <TableCell align="right">{orderData.customerData.street}</TableCell>
          </TableRow>
          <TableRow key="house-number">
            <TableCell component="th" scope="row">
              Numer domu
            </TableCell>
            <TableCell align="right">{orderData.customerData.houseNumber}</TableCell>
          </TableRow>
          <TableRow key="flat-number">
            <TableCell component="th" scope="row">
              Numer mieszkania
            </TableCell>
            <TableCell align="right">{orderData.customerData.flatNumber}</TableCell>
          </TableRow>
          <TableRow key="zip-code">
            <TableCell component="th" scope="row">
              Kod pocztowy
            </TableCell>
            <TableCell align="right">{orderData.customerData.zipCode}</TableCell>
          </TableRow>
          <TableRow key="city">
            <TableCell component="th" scope="row">
              Miasto
            </TableCell>
            <TableCell align="right">{orderData.customerData.city}</TableCell>
          </TableRow>
          <TableRow key="phone">
            <TableCell component="th" scope="row">
              Telefon
            </TableCell>
            <TableCell align="right">{orderData.customerData.phone}</TableCell>
          </TableRow>
          <TableRow key="email">
            <TableCell component="th" scope="row">
              Adres e-mail
            </TableCell>
            <TableCell align="right">{orderData.customerData.email}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Summary(props) {
  const orderData = props.orderData;
  return (
    <div>
      <h1>Podsumowanie</h1>
      <OrderSummary orderData={orderData} />
    </div>
  );
}

function App() {
  return (
    <Container maxWidth="sm">
      <OrderSteps />
    </Container>
  );
}

const domContainer = document.querySelector('#container');
ReactDOM.render(<App />, domContainer);
