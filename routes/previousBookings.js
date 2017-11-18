var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

var userid;
var fromDate;
var toDate;

router.get('/', function(req, res, next) {
	if(req.session.user == 1) {
		// Set id from cookies
		userid = req.session.id;

		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'VEHICLE_RENTAL'
		});

		con.connect(function(err) {
			if(err) throw err;

			console.log('Connected');

			var sql = "SELECT p.Pay_ID as PID, Pay_Date, Amount, Method, Book_ID, Plate_No, Start_Date, End_Date, No_of_Days FROM Booking b, Payment p WHERE p.Pay_ID = b.Pay_ID AND p.User_ID = b.User_ID AND Success = 1 AND p.User_ID = '" + userid + "' order by Book_ID desc;";
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["payid"] = result[i].PID;
					ob["paydt"] = result[i].Pay_Date;
					ob["amt"] = result[i].Amount;
					ob["method"] = result[i].Method;
					ob["bid"] = result[i].Book_ID;
					ob["plno"] = result[i].Plate_No;
					ob["sdt"] = result[i].Book_Date;
					ob["edt"] = result[i].End_Date;
					ob["ndays"] = result[i].No_of_Days;

					vdata.push(ob);
				}

				res.render('previousBookings', { title: 'Booking History', uid: userid, vdata: vdata });
			});
		});
	} else {
		res.redirect('/login');
	}
});


module.exports = router;
