import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import Router from './routes/Router';
import GlobalErrorHandler from './utils/errors/GlobalErrorHandler';
import oracledb from 'oracledb';

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

// Router
app.use('/api/v1', Router);
app.get('/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/17185582/UVC3moBQ');
});
app.get('/users', (req, res) => {
    async function fetchData() {
        console.log('first')
        let connection;

        let connectString = "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = oracle.wpi.edu)(PORT =1521))(CONNECT_DATA =(SID=ORCL)))"
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try {
            connection = await oracledb.getConnection({
                user: process.env.Db_user,
                password: process.env.Db_pass,
                connectString: connectString
            });
            console.log("Successfully connected to Oracle!")
            connection.execute(
                `SELECT * FROM users`,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    res.send(result.rows);
                    return result;
                 
                });
        
        } catch (err) {
            console.log("Error: ", err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.log("Error when closing the database connection: ", err);
                }
            }
        }
    }

    fetchData().then(dbres=> {
           console.log(dbres)
        res.send(dbres);
    }).catch(err => {
        console.log(err)
    })

})



app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.statusCode = 404;
    error.flag = true;
    return next(error);
});

// Error handler
app.use(GlobalErrorHandler);

export default app;
