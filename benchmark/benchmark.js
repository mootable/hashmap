const fse = require('fs-extra');
const {escape} = require('html-escaper');
const pathToHere = './benchmark/';

//const create = require('./benchmarks/create');

// const get_end     = require('./benchmarks/get_end');
// const get_middle  = require('./benchmarks/get_middle');
// const get_none    = require('./benchmarks/get_none');
// const get_start   = require('./benchmarks/get_start');

const reportSingle = (testLocation) =>
    require(testLocation).then(report => {
        return {
            benchmark: report.name,
            type: 'single',
            results: report.results,
            testFile: fse.readFileSync(
                `${pathToHere}${testLocation.indexOf('./') === 0 ? testLocation.substring(2) : testLocation}.js`,
                'utf-8')
        };
    });
const reportMultipleImplementations = (testLocation, benchmark) => Promise.all(require(testLocation))
    .then(allResults => {
        console.log(allResults);
        const ret = {
            benchmark,
            type: 'multiple',
            results: allResults.map(({name, implementation, report}) => {
                return {
                    name, implementation, results: report.results
                };
            }),
            testFile: fse.readFileSync(
                `${pathToHere}${testLocation.indexOf('./') === 0 ? testLocation.substring(2) : testLocation}.js`,
                'utf-8')
        };
        return ret;
    });
Promise.all([
    reportSingle('./benchmarks/create'),
    reportMultipleImplementations('./benchmarks/set_get_delete', 'Set Get Delete'),
    // reportMultipleImplementations('./benchmarks/get_end', 'Get End'),
    // reportMultipleImplementations('./benchmarks/get_middle', 'Get Middle'),
    // reportMultipleImplementations('./benchmarks/get_none', 'Get None'),
    // reportMultipleImplementations('./benchmarks/get_start', 'Get Start'),
]).then(reports => [
    fse.outputJson(`benchmark_results/benchmarks.json`, reports),
    ...reports.map(report => fse.outputJson(`benchmark_results/benchmarks.${report.benchmark.replace(/\s/g, "")}.json`, report)),
    ...reports.filter(({type}) => type === 'multiple')
        .map(report => fse.outputFile(`benchmark_results/benchmarks.${report.benchmark.replace(/\s/g, "")}.html`, generateLineChart(report))),
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
    console.log(report);
    const testFile = report.testFile;
    const testSetup = testFile.includes('// BENCH-SETUP-START') ?
        testFile.substring(testFile.indexOf('// BENCH-SETUP-START') + 20, testFile.indexOf('// BENCH-SETUP-END')) :
        undefined;
    const testExecution = testFile.includes('// BENCH-TEST-START') ?
        testFile.substring(testFile.indexOf('// BENCH-TEST-START') + 19, testFile.indexOf('// BENCH-TEST-END')) :
        undefined;
    const safeBenchmarkName = report.benchmark.replace(/\s/g, "");
    const labels = report.results[0].results.map(({name}) => name);
    const datasets = report.results.flatMap((impl, index) => {
        // const margin = report.margin/100;
        // const upperMargin = 1 + margin;
        // const lowerMargin = 1 - margin;
        return [
            {
                backgroundColor: colours[index] + '30',
                borderColor: colours[index] + '00',
                pointRadius: 0,
                fill: '+1',
                data: impl.results.map(({ops, details}) => ops * (1 + (details.relativeMarginOfError / 100))),
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            },
            {
                label: impl.name,
                backgroundColor: colours[index] + '50',
                borderColor: colours[index],
                borderDash: impl.implementation.classification === 'mootable' ? undefined
                    : impl.implementation.classification === 'native' ? [5, 3] : [2, 2],
                data: impl.results.map(({ops}) => ops),
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }, {
                backgroundColor: colours[index] + '30',
                borderColor: colours[index] + '00',
                pointRadius: 0,
                data: impl.results.map(({ops, details}) => ops * (1 - (details.relativeMarginOfError / 100))),
                cubicInterpolationMode: 'monotone',
                fill: '-1',
                tension: 0.4
            },
        ];

    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-tomorrow.min.css"</link>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div style="max-height:90%;max-width: 90%;">
<h1>${report.benchmark}</h1>
<h2>Results</h2>
    <canvas id="${safeBenchmarkName}Chart"></canvas>
${testSetup ? `<h3>Setup</h3><pre class="language-javascript"><code class="language-javascript">${escape(testSetup)}</code></pre>` : ''}
${testExecution ? `<h3>Test</h3><pre class="language-javascript"><code class="language-javascript">${escape(testExecution)}</code></pre>` : ''}
    <script type="application/javascript">
const ${safeBenchmarkName}Chart = function() {
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
                filler: {
                    propagate: false
                },
                title: {
                    display: true,
                    text: '${report.benchmark}'
                },
                legend: {
                    labels: {
                        filter: function (item, data) {
                            return item.text !== undefined;
                        },
                    },
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                    text: 'Prefilled Map Size',
                    }
                },
                y: {
                    display: true,
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Operations per second',
                    }
                }
            }
            },
        };
    const ctx = document.getElementById('${safeBenchmarkName}Chart');
    return new Chart(ctx, config );
    }();
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"></script>

</div>
</body>
</html>
`;
}