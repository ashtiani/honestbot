module.exports = (req, res) => {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'honest1234');
		console.log("token : " + verifyTokenMatches)
    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
				console.log("verification completed")
    } else {
        res.status(403).end();
				console.log("something is wrong!")
    }
};
