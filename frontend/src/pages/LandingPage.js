import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <Container fluid={true}>
       <Row className='d-flex justify-content-center align-items-center mx-5 pt-5 gx-5' data-aos="fade-up">
        <Col md={6} className='d-flex align-items-center'>
            <div data-aos="fade-up" className='d-flex flex-column justify-content-center align-items-center gx-5'>
            <h1 className='text-dark'>
                <span className='text-primary me-2'>Connect </span> with your circle in fun way!
            </h1>
            <h5 className='text-dark'>
                Chat App makes your communication with relatives, work friends, family more fun. Stay connected with them with plentiful features.
            </h5>
            <div className='d-flex align-self-start'>
            <Link className='btn btn-primary mt-5' to="/login">
                Let's get started
            </Link>
            </div>
            </div>
        </Col>
        <Col md={6} className='d-flex justify-content-center align-items-center my-4'>
         <div data-aos="fade-up" className='d-flex justify-content-center'>
         <lottie-player src="https://lottie.host/4b3a631b-838b-4d2c-973f-8b06e927a86b/9YwAWZJKWR.json" background="transparent" speed="1" style={{width:"100%",height:"100%"}} loop autoplay></lottie-player>
         </div>
        </Col>
       </Row>
    </Container>
  )
}

export default LandingPage;