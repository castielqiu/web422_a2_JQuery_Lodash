/*********************************************************************************
 * WEB422 –Assignment 2
 * I declare that this assignment is my ownwork in accordance with SenecaAcademic Policy.
 * No part of this assignment has been copied manuallyor electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 * Name: ZHI WEI QIU Student ID: 143304186 Date: JAN 31,20
 * 
 * 
 ********************************************************************************/

//Declare variables
let saleData = [];

let page = 1;

const perPage = 10;

//lodash tabletemplate
const saleTableTemplate = _.template(`<% _.forEach(saleData,function(data)
    { %>
    <tr data-id=<%- data._id %>>
    <td><%- data.customer.email %></td>
    <td><%- data.storeLocation %></td>
    <td><%- data.numberOfItem %></td>
    <td><%- moment.utc(data.saleDate).local().format('LLLL') %></td>
    </tr>
    <%
    });
%>` );

//lodash modeltemplate
let saleModelBodyTemplate = _.template(`
    <h4>Customer</h4>
    <strong>email:</strong> <%- clickedSale.customer.email %><br>
    <strong>age:</strong> <%- clickedSale.customer.age %><br>
    <strong>satisfaction:</strong><%- clickedSale.customer.satisfaction %> / 5
    <br><br>
    <h4> Items: $<%- clickedSale.total.toFixed(2) %> </h4>
    <table class="table">
    <thead>
    <tr>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Price</th>
    </tr>
    </thead>
    <tbody>
    <% _.forEach(clickedSale.items,function(data) { %>
    <tr>
    <td><%- data.name %></td>
    <td><%- data.quantity %></td>
    <td>$<%- data.price %></td>
    </tr> 
    <% }); %>
    </tbody>
    </table>`);


//populate saleData array from API

function loadSaleData() {
    //fetch data from heroku
    fetch(`https://w2020116a.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
        .then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                //set the global saleData array to be the data returned from the request
                saleData = myJson.data;
                //invoke the saleTableTemplate from the request,store the return value in a variable
                let saleTable = saleTableTemplate({saleData});
                //set <tbody> element "sale-table"
                $("#sale-table tbody").html(saleTable);
                //set current-page element to be the value of the current page
                $("#current-page").html(page);

            })
        .catch(err => { console.log(`Fetch error`, err) });
}

// invoke the loadSaleData() function

$(function () {
    loadSaleData();
    $("#sale-table tbody").on("click", "tr", function () {
        //store the id
        let clickedId = $(this).attr("data-id");
        //find the mathcing sale document within saleData
        let clickedSale = _.find(saleData, function (sale) {
            return sale._id == clickedId;
        })

        //assign total to clickedSale
        clickedSale.total = 0;
        //loop through items array to add up the total
        for (let i = 0; i < clickedSale.items.length; i++) {
            clickedSale.total += (clickedSale.items[i].price * clickedSale.items[i].quantity);
        }
        $("#sale-modal .modal-title").html(`Sale:${clickedSale._id}`);
        $("#sale-modal .modal-body").html(saleModelBodyTemplate({clickedSale}));
        $('#sale-modal').modal({
            backdrop: 'static', // disable clicking on the backdrop to close
            keyboard: false // disable using the keyboard to close
        });

    })

    //set previous page
    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
            loadSaleData();
        }
    })
    //set next page
    $("#next-page").on("click", function () {

        page++;
        loadSaleData();

    })
});






