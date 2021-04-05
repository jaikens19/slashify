import React from 'react'


const SearchRow = ({result}) => {
    const [id, data] = result
    return(
        <>
        <p>{data.name}</p>
        </>
    )
}

export default SearchRow