const fse = require('fs-extra');


const create = require('./benchmark_create');
const setgetdelete = require('./benchmark_setgetdelete');
const reportSingle = (promise) =>
    promise.then(report => {
        return {
            benchmark: report.name, type: 'single', results: report.results.map(({name, ops}) => {
                return {name, ops};
            }).sort((a, b) => b.ops - a.ops)
        };
    });
const reportMultipleImplementations = (promises, benchmark) => Promise.all(promises)
    .then(allResults => {
        return {
            benchmark,
            type: 'multiple',
            results: allResults.map(({name: parent, classification, report}) => {
                return {
                    name: parent, classification, results: report.results.map(({name, ops}) => {
                        return {name, ops};
                    })
                };
            })
        };
    });
Promise.all([
    reportSingle(create),
    reportMultipleImplementations(setgetdelete, 'SetGetDelete')
]).then(reports => [
    fse.outputJson(`benchmark_results/benchmarks.json`, reports),
    ...reports.map(report => fse.outputJson(`benchmark_results/benchmarks.${report.benchmark}.json`, report)),
    ...reports.filter(({type}) => type === 'multiple')
        .map(report => fse.outputFile(`benchmark_results/benchmarks.${report.benchmark}.html`, generateLineChart(report))),
    // ...reports.filter(({type}) => type === 'single')
    //     .map(report => fse.outputFile(`benchmark_results/benchmarks.html`, generateBarChart(report)))
]);
const colours = [
    '#6929c4',
    '#1192e8',
    '#005d5d',
    '#9f1853',
    '#fa4d56',
    '#570408',
    '#198038',
    '#002d9c',
    '#ee538b',
    '#b28600',
    '#009d9a',
    '#012749',
    '#8a3800',
    '#a56eff',
];

function generateLineChart(report) {
    const labels = report.results[0].results.map(({name}) => name);
    const datasets = report.results.map((impl,index) => {
        return {
            label: impl.name,
            backgroundColor: colours[index]+'88',
            borderColor: colours[index],
            borderDash: impl.classification === 'mootable' ? undefined : impl.classification === 'native' ? [5, 3] : [2,2],
            data: impl.results.map(({ops}) => ops)};
    });
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible"/>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script  type="application/javascript">

        const labels = ${JSON.stringify(labels)};
        const data = {
            labels: labels,
            datasets: ${JSON.stringify(datasets)}
        };

        const config = {
            type: 'line',
            data,
            options: {
            responsive: true,
                plugins: {
                title: {
                    display: true,
                    text: '${report.benchmark}'
                }
            },
            scales: {
                x: {
                    display: true,
                    text: 'Prefilled Map Size',
                },
                y: {
                    display: true,
                    type: 'logarithmic',
                    text: 'Operations per second',
                }
            }
            },
        };
    </script>
</head>
<body>
<div style="max-height:90%;max-width: 90%;">
    <canvas id="${report.benchmark}Chart"></canvas>
</div>
<script type="application/javascript">
    const ctx = document.getElementById('${report.benchmark}Chart');
    const ${report.benchmark}Chart = new Chart(ctx, config );
</script>
</body>
</html>
`;
}