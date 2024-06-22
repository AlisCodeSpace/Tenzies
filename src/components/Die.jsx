export default function Die(props) {
    const dotPositions = {
        1: "auto / auto",
        2: "auto / auto auto",
        4: "auto auto / auto auto ",
        6: "auto auto auto / auto auto"
    }

    const style = {
        backgroundColor: props.isHeld ? '#59E391' : '#ffffff',
        gridTemplate: dotPositions[props.value],
    }

    const dotStyles = [
        {
            gridColumn: "1 / 2",
            gridRow: "1 / 2"
        },
        {
            gridColumn: "3 / 4",
            gridRow: "1 / 2"
        },
        {
            gridColumn: "2 / 3",
            gridRow: "2 / 3"
        },
        {
            gridColumn: "1 / 2",
            gridRow: "3 / 3"
        },
        {
            gridColumn: "3 / 4",
            gridRow: "3 / 3"
        }
    ]

    function oddStyles() {
        if (props.value === 5) {
            return true
        }         
        if (props.value === 3) {
            return true
        }
        return false
    }

    

    function dots() {
        const dotsArray = []
        for (let i = 0; i < props.value; i++) {
            dotsArray.push(<div className={"dice--" + i} style={oddStyles() ? dotStyles[i] : null}></div>) 
        }

        return dotsArray;
    }

    return (
        <div className="dice--dots" onClick={props.gameStarted && props.holdDice} style={style}>
            {dots()}
        </div>
    )
}