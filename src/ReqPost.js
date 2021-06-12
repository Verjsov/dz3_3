import { Component } from 'react';
import axios from 'axios';

export class ReqPost extends Component {
    state = {
        id:'',
        title:'',
        body:'',

        isLoading: false,
        data: null,
        isFormSent: false,
        errors:{
            title:true,
            body:true,
            form:true,
            get:true,
            post:true

        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let isErrorForm = this.checkErrorForm();

        this.setState((state, props) => {
            return {
                isFormSent: true,
                errors: {
                    ...this.state.errors,
                    form: isErrorForm
                }
            };});

        if (!isErrorForm) {
            axios.post("https://60bb880442e1d00017620c95.mockapi.io/Posts/", {
                id: this.state.id,
                createdAt: new Date().toISOString(),
                title: this.state.title,
                body: this.state.body
            })
                .then( (response) => {
                    console.log(response);
                    this.setState({
                        errors:{
                            ...this.state.errors,
                            post: false
                        },
                        isLoading: false,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        errors:{
                            ...this.state.errors,
                            post: true
                        },
                        isLoading: false,
                    });
                });

            this.setState({
                isLoading: true,
            });
        }
    };

    handleChangeTextInput = (e) => {
        let { target } = e,
            name = target.name,
            val = target.value;
        let isError = val === '';

        if (name === 'title') {
            this.setState({
                [name]: val,
                errors:{
                    ...this.state.errors,
                    title: isError
                }
            });
        } else if (name === 'body') {
            this.setState({
                [name]: val,
                errors:{
                    ...this.state.errors,
                    body: isError
                }
            });
        }
    };
    checkErrorForm = (e) => {
        let isErrorForm = this.state.errors.title || this.state.errors.body;
        return isErrorForm;
    }


    componentDidMount() {
        axios.get("https://60bb880442e1d00017620c95.mockapi.io/Posts/")
            .then((res) => {
                let { status, data } = res;
                let error = status === 200 ? null : `Something went wrong. Error code: ${status}`;
                let id = '';
                if (error == null) {
                    id = parseInt(data[data.length - 1].id) + 1;
                }
                this.setState({
                    id: id,
                    errors: {
                        ...this.state.errors,
                        get:false
                    },
                });
            })
            .catch((error) => {
                this.setState({
                    id: null,
                    errors: {
                        ...this.state.errors,
                        get: true
                    },
                });
            });
    }

    render() {

        return (
            <div className="example">
                <form onSubmit={this.handleSubmit} className="filters" style={{width:"450px",margin:"0 auto"}}>
                    <div className="filters__cont">

                        { (!this.state.errors.post && this.state.isFormSent) && <div className="success">Данные успешно загружены!</div> }
                        { (this.state.errors.post && this.state.isFormSent) && <div className="errorMessage">Ошибка загрузки данных!</div> }
                        { (this.state.errors.form && this.state.isFormSent) && <div className="errorMessage">Заполните все поля формы!</div> }

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Title</span>
                            <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChangeTextInput} placeholder="" aria-label="Title"
                                   aria-describedby="basic-addon1"/>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Body</span>
                            <input type="text" className="form-control" name="body" value={this.state.body} onChange={this.handleChangeTextInput} placeholder="" aria-label="Body"
                                   aria-describedby="basic-addon1"/>
                        </div>

                        <input className="btn btn-primary" style={{ margin:"10px 0 0 0" }} type="submit"  value="Отправить"/>

                    </div>
                </form>

            </div>
        );
    }
}