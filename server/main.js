import {Meteor} from 'meteor/meteor';
import {Mongo} from "meteor/mongo";
import {createQuery} from 'meteor/cultofcoders:grapher';
import moment from 'moment';

Meteor.startup(() => {

    // Create mongoDB collections
    Book = new Mongo.Collection('Book');
    Author = new Mongo.Collection('Author');

    // Clean DB
    Book.remove({});
    Author.remove({});

    // Insert elements for testing
    let id = Author.insert({
        name: "name of the item"
    })
    Book.insert({
        authorId: id,
        date: moment("10/08/2019", "MM/DD/YYYY").toDate()
    });

    // Create links
    Book.addLinks({
        'author': {
            collection: Author,
            field: 'authorId',
        }
    });
    Author.addLinks({
        'books': {
            type: 'many',
            collection: Book,
            inversedBy: "author",
        }
    });

    let startDate = moment("09/07/2019", "MM/DD/YYYY").toDate();
    let endDate = moment("12/10/2019", "MM/DD/YYYY").toDate();

    // Create Query
    let grapherQueryWithFiltering = createQuery('grapherQueryWithFiltering', {
        Author: {
            name: 1,
            books: {
                $filters: {
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                },
            }
        }
    });

    let grapherQueryWithOutFiltering = createQuery('grapherQueryWithOutFiltering', {
        Author: {
            name: 1,
            books: {
                date: 1,
            }
        }
    });

    let booksFromMongoQuery = Book.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }, {fields: {date: 1}});

    console.log("grapherQueryWithFiltering.fetchOne().books = ", grapherQueryWithFiltering.fetchOne().books);
    console.log("grapherQueryWithOutFiltering.fetchOne().books = ", grapherQueryWithOutFiltering.fetchOne().books);
    console.log("booksFromMongoQuery.fetch() = ", booksFromMongoQuery.fetch());

});
