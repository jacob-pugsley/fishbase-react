import { Fragment, useState } from "react"
import { SearchResult } from "./interfaces/SearchResult"
import SearchResultDisplay from "./SearchResultDisplay"
import Axios from "axios"

import "../styles/MainSearchForm.css"

const MainSearchForm = () => {
    const axios = Axios.create()

    const resultsPerPage: number = 4

    const [results, setResults] = useState([] as SearchResult[])
    const [currentPage, setCurrentPage] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")

    const updateErrorMessage = (message: string) => {
        setErrorMessage(message)
    }

    const prevPage = () => {
        setCurrentPage((prevState: number) => {
            return (prevState === 0 ? 0 : prevState - 1)
        })
    }

    const nextPage = () => {
        setCurrentPage((prevState: number) => {
            return (
                prevState === (Math.ceil(results.length / resultsPerPage) - 1) ?
                prevState : prevState + 1
            )
        })
    }

    const pushResult = (result: SearchResult) => {
        setResults((prevState: SearchResult[]) => {
            return [...prevState, result]
        })
    } 


    const handleSearch = () => {
        console.log("handling search")
        setResults([])
        
        let url = "http://localhost:5000/params=$"

        //get all the search param inputs
        const paramInputs: HTMLCollection = 
            document.getElementsByClassName("searchParam")

        //url = url + taxonomy + "$" + commonName + "$" + tempMin + "$" + tempMax + "$" + phMin + "$" + phMax

        let paramString = ""

        for( let el of paramInputs ) {
            console.log(el)
            let elInput: HTMLInputElement = el as HTMLInputElement
            paramString = paramString + elInput.value + "$"
        }
        //remove trailing $
        paramString = paramString.substring(0, paramString.length - 1)
        paramString.replace(" ", "%20")

        url = url + paramString

        console.log("url is ", url)

        let pt: any[] = []


        axios.get(url)
        //after successful call
        .then((response) => {
            //push all results onto the results array
            console.log("made axios request")
            console.log(response.data) 
            if( Object.keys(response.data.results).length === 0 ) {
                updateErrorMessage("No results.")
            } else {
                updateErrorMessage("")
                for( let i = 0; i < Object.keys(response.data["results"]).length; i++ ){

                    if( !pt.includes(response.data["results"][""+i]["taxonomy"]) ){
                        pt.push(response.data["results"][""+i]["taxonomy"])
                        pushResult(response.data["results"][""+i])
                    }

                }
            }
        })
        //after error
        .catch( function (error) {
            console.log("Error!")
            console.log(error)
            updateErrorMessage(error)
        })
    }

    const getSearchResultSlice = () => {
        let start: number = (currentPage * resultsPerPage)

        let end: number = ((currentPage+1) * resultsPerPage) - 1

        return results.slice(start, end + 1)
    }

    return (
        <div>
            <div className="mainContentDiv">
                <h1 id="titleH1">simple<b>Fishbase</b><span> v2.0</span></h1>
                <div >
                    <div id="taxonDiv">
                        <input placeholder="Genus + Species" name="taxonomy" className="searchParam"/>
                        <br />
                        <input placeholder="Common Name" name="common" className="searchParam" />
                    </div>

                    <div  className="searchFormDiv">
                        <input placeholder="pH Min" name="phMin" className="searchParam" />
                        <input placeholder="pH Max" name="phMax" className="searchParam" />
                    </div>

                    <div className="searchFormDiv">
                        <input placeholder="Temperature Min (ºC)" name="tempMin" className="searchParam" />
                        <input placeholder="Temperature Max (ºC)" name="tempMax" className="searchParam" />
                    </div>
                    <div className="searchFormDiv">
                        <button type="button" id="submitBtn" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>

            {results.length > 0 &&
                <Fragment>
                    <div id="resultControlDiv">
                        <p id="pageCount"><i>Showing page {currentPage + 1} of { Math.ceil(results.length / resultsPerPage) }.</i></p>
                        <div id="pageButtons">
                            <button type="button" onClick={prevPage}>Previous Page</button>
                            <button type="button" onClick={nextPage}>Next Page</button>
                        </div>
                    </div>
                    <div>

                        {getSearchResultSlice().map((result: SearchResult) => <SearchResultDisplay key={result.id} result={result} />)}
            
                    </div>
                </Fragment>
            }
            {errorMessage.length > 0 &&
                <p id="errorP">{errorMessage}</p>
            }
        </div>
    )

}

export default MainSearchForm