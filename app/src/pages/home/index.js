import React, { Component }							from 'react';
import { Col, Card, Row, Button, Icon, Preloader }	from 'react-materialize';

import Dropzone			from 'react-dropzone';
import {Doughnut}		from 'react-chartjs-2';
import {logoName}		from '../../config/stargazer'
import services			from '../../config/services'
import Footer			from '../../components/footer'

import '../../index.css';
import './index.css';

const donutData = {
	labels: [],
	datasets: [{
		data: [],
		backgroundColor: [],
		hoverBackgroundColor: []
	}],
	text: '56%'
}

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			faceFound: false,
			isInvalid: false
		}
		this.handleUpload = this.handleUpload.bind(this);
	}
	handleUpload(event) {
		const	self		= this;
		let		reader		= new window.FileReader();

		if (!event[0])
			return self.setState({isInvalid: true, invalidText: 'You selected an invalid file'});

		this.setState({isLoading: true, isInvalid: false});
		reader.readAsDataURL(event[0]);
		reader.onloadend = function() {
			services('uploadImage', {file: reader.result}, function (err, response) {
				if (err) {
					self.setState({isLoading: false, faceFound: false, isInvalid: false});
					return ;
				}
				donutData.labels			= [];
				donutData.datasets[0].data	= [];

				if (response.data.error)
					return self.setState({isLoading: false, faceFound: false, isInvalid: true, invalidText: response.data.error});

				/* Insert data into our donut */
				for (var i = 0; i < response.data.attributes.length; i++) {
					donutData.labels.push(response.data.attributes[i].type)
					donutData.datasets[0].data.push(response.data.attributes[i].value)
					donutData.datasets[0].backgroundColor.push(response.data.attributes[i].backgroundColor)
					donutData.datasets[0].hoverBackgroundColor.push(response.data.attributes[i].hoverBackgroundColor)
				}
				self.setState({isLoading: false, faceFound: true, race: donutData.labels[0], isInvalid: false});
			});
		}
	}
	componentDidMount() {
		document.title =  `${logoName} - Home`;
	}
	render() {
		const {isLoading, faceFound, race, isInvalid, invalidText} = this.state;

		return (
			<div>
				<Row>
					<Col m={12} s={12}>
						<div className="upload-container">
							<Dropzone
								multiple={false}
								accept="image/*"
								style={{height: 'auto', width: 'auto'}}
								onDrop={this.handleUpload.bind(this)}>
						      <Button className="select">Select / Drag your picture</Button>
						    </Dropzone>
						</div>
					</Col>
					<Col l={2} m={2} s={12}></Col>

					<Col l={8} m={8} s={12}>
						<Card className="card-kairos-informations">
							<Icon className="info">information</Icon>
							<span className="text">We accept only *.PNG and *.JPG files</span>
						</Card>

						{isLoading &&
							<Card className="card-kairos loading">
								<Preloader size='small' className="pull-center"/>
							</Card>}

						{!isLoading && faceFound &&
							<Card className="card-kairos">
								<span className="text">This person seems to be {race}</span>
								<div className="donut">
									<Doughnut data={donutData} height={15} width={30}/>
								</div>
							</Card>}

						{isInvalid &&
							<Card className="card-kairos">
								<span className="text error">{invalidText}</span>
							</Card>}
					</Col>

					<Col l={2} m={2} s={12}></Col>
				</Row>
				<Footer />
			</div>
		);
	}
}

export default Home;
