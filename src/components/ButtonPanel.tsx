const ButtonPanel = (props: any) => {

    const labels: string[] = props.labels

    const clickButton = (label: string) => {
        props.onClick(label)
    }

    return (
        <div id="buttonPanel">
            {labels.map((label: string) => <button onClick={() => clickButton(label)}>{label}</button>)}
	    </div>
    )

}

export default ButtonPanel