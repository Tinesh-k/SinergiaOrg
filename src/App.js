import React from 'react';
import BarChart from 'react-bar-chart';
import axios from "axios";
import Select from 'react-select';
import qs from "qs";
// const data = [
//   {text: 'Man', value: 500}, 
//   {text: 'Woman', value: 300} 
// ];
 
const margin = {top: 20, right: 20, bottom: 30, left: 100};
class ConstructorExample extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      width: 500 ,
      data:[],height:500,
      selectedOption: null,options:[],optionsCity:[],selectedOptionCity:null,
      isLoading:false,
      errormessage:false
		}
	}
  
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    axios.get("https://api.openaq.org/v1/countries").then(res=>{
      console.log("pok",res);
      const test=res.data.results.map(i=>({
        value:i.code,
        label:i.name
      }))
      this.setState({options:test,errormessage:false})
    })
    axios.get(`https://api.openaq.org/v1/cities?country=${selectedOption.value}`).then(res=>{
      console.log("pok",res);
      const test=res.data.results.map(i=>({
        value:i.city,
        label:i.city
      }))
      this.setState({optionsCity:test})
    })

  }

  handleChangeCity = selectedOptionCity => {
    this.setState({ selectedOptionCity });
    console.log(`Option selected:`, selectedOptionCity);
   this.setState({isLoading:true})
    axios.get('https://api.openaq.org/v1/locations',{
      params: {
        city:[selectedOptionCity.value]
      },
      paramsSerializer: params => {
        return qs.stringify(params)
      }
    }).then(res => 
    {
      this.setState({isLoading:false,errormessage:false})
      console.log("result",res.data.results)
      const resultantArray=res.data.results.map(i=>({ 
        count:i.count,
        parameters:i.parameters
      }))
      console.log("resultantArray",resultantArray)
      const formattedArray=resultantArray.map(i=>i.parameters.map(ite=>({
        value:i.count,
        text:ite
      })))
      console.log("formattedArray",formattedArray)
    
    const flatternArray=formattedArray.flat();
    console.log("hhs",flatternArray)
     this.setState({data: flatternArray});
       }).catch(()=>{
        this.setState({isLoading:false,errormessage:true})
       }); 
    
  };


	componentDidMount() {
    window.onresize = () => {
      this.setState({width: this.refs.root.offsetWidth}); 
     };
     this.setState({isLoading:true})
     axios.get('https://api.openaq.org/v1/locations').then(res => 
{
  console.log("result",res.data.results)
  this.setState({isLoading:false,errormessage:false})
  const resultantArray=res.data.results.map(i=>({ 
    count:i.count,
    parameters:i.parameters
  }))
  console.log("resultantArray",resultantArray)
  const formattedArray=resultantArray.map(i=>i.parameters.map(ite=>({
    value:i.count,
    text:ite
  })))
  console.log("formattedArray",formattedArray)

const flatternArray=formattedArray.flat();
console.log("hhs",flatternArray)
 this.setState({data: flatternArray});
   }).catch(()=>{
    this.setState({isLoading:false,errormessage:true})
   }); 



axios.get("https://api.openaq.org/v1/countries").then(res=>{
  console.log("pok",res);
  const test=res.data.results.map(i=>({
    value:i.code,
    label:i.name
  }))
  this.setState({options:test})
})

	}
 
	render() {
    const { selectedOption,options,optionsCity,selectedOptionCity,errormessage } = this.state;
		return (
      <div ref='root'>
        
        <div className="container"></div>
         <div className="row">
         <div className="col-sm-4 col-md-4 col-lg-4 col-xs-4">
           Country :
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-8">
            <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options} 
        />
            </div>
         
            </div>'
     <div className="row">
     <div className="col-sm-4 col-md-4 col-lg-4 col-xs-4">
           City :
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xs-8">
            <Select
        value={selectedOptionCity}
        onChange={this.handleChangeCity}
        options={optionsCity} 
        />
            </div>
     </div>
       
    { this.state.isLoading===true?<h4 className="info-reader">Please wait......</h4>:
    
    errormessage===true?<h4 className="info-reader">Unable to fetch data.</h4>:
    
    <div style={{width: '100%'}}> 
          <BarChart ylabel='Quantity'
            width={this.state.width}
            height={this.state.height}
            margin={margin}
            data={this.state.data}
            xlabel="Pollution Items"
        //    svg={{ fill: 'green' }}
           
            />
      </div>}
  </div>
		)
	}
}


export default ConstructorExample;
