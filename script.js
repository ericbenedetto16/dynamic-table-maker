"use strict";

const {
  location: { href }
} = window;
const url = new URL(href);

const { searchParams } = url;
const BBL = searchParams.get("bbl");

const preparePage = async () => {
  const dataObject = await getData();
  appendData(dataObject, BBL);
};

const getData = async () => {
  const data = await fetch("https://www1.nyc.gov/assets/oer/downloads/csv/historical_data_information.csv");

  const raw = await data.text();

  const dataObject = { raw, parsed: [] };

  const headers = raw.split(/\n/)[0].split(/\,/);
  const rows = raw.split(/\n/).slice(1);

  rows.forEach((row, rowNum) => {
    const cols = row.split(/\,(?=(?:[^"']|["|'][^"']*")*$)/, headers.length);
    dataObject.parsed.push({});

    cols.forEach((data, iteration) => {
      dataObject.parsed[rowNum][headers[iteration]] = data;
    });
  });

  return dataObject;
};

const appendData = (dataObject, bbl) => {
  $(".span9.about-main-image").css({ display: "block", float: "none" });

  const records = dataObject.parsed.filter(obj => obj.BBL == bbl);

  if (records.length > 1) {
    let html =
      "<table class='rt'><thead><tr><th style='text-align:center;width:100%;' colspan='7'>Historical Site Information</th></tr><tr>";
    Object.keys(records[0]).forEach(key => {
      html += `<th>${key}</th>`;
    });

    html += "</tr></thead><tbody>";

    records.map(record => {
      html += "<tr>";
      Object.values(record).forEach(val => {
        html += `<td>${val}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";
    $(".span6.about-description").append(html);
  } else {
    $(".span6.about-description").append("<h1>No Matching Records Found</h1>");
  }
};

preparePage();
