import { SearchResult } from "./interfaces/SearchResult"

import "../styles/SearchResultDisplay.css"
import { useState } from "react"

const SearchResultDisplay = (props: any) => {
    const result: SearchResult = props.result
    
    const [minified, setMinified] = useState(true)

    const toggleMinified = () => {
        setMinified((prevState: boolean) => {
            return !prevState
        })
    }

    const compileBio = () => {
        const remark: string = result.remark
        const bio1: string = result.bio1
        const bio2: string = result.bio2

        const res: string = remark 
            + (remark.length > 0 ? "\n\n" : "")
            + bio1 + (bio1.length > 0 ? "\n\n" : "")
            + bio2
        
        return res.length > 0 ? res : "No description provided."
        
    }

    return (
        <div className="mainContentDiv" onClick={toggleMinified}>
            <div className="titleBox">
                <div className="flexItem">
                    <img className="smallImage" src={"http://fishbase.us/images/species/" + result.image} alt="A fish." /> 
                </div>
                <div className="flexItem">
                    <h2 className="taxonH2">{result.taxonomy}</h2>
                    <p className="taxonP">{result.commonName.length > 0 ? result.commonName : "Common name not found."}</p>
                </div>
            </div>
            {!minified && 
                <p className="bioP">{compileBio()}</p>
            }
        </div>
    )
}

export default SearchResultDisplay