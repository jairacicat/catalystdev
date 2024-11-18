/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
define(['N/file', 'N/record', 'N/runtime', 'N/log', 'N/error'],
    function (file, record, runtime, log, error) {

        function getInputData() {
            var csvFileId = 881493;
            var csvFile = file.load({ id: csvFileId });
            var fileContent = csvFile.getContents();
            var lines = fileContent.split(/\r?\n/);
            var data = [];

            // Parse CSV file contents and prepare data array
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i];
                if (line) {
                    var columns = line.split(',');
                    var internalId = columns[0];
                    var kantataValue = columns[1];

                    if (internalId && kantataValue) {
                        data.push({
                            internalId: internalId,
                            kantataValue: kantataValue
                        });
                    }
                }
            }
            return data;
        }

        function map(context) {
            try {
                var value = JSON.parse(context.value);
                var internalId = value.internalId;
                var kantataValue = value.kantataValue;

                // Load and update the project task record
                var projectTask = record.load({
                    type: record.Type.PROJECT_TASK,
                    id: internalId,
                    isDynamic: true
                });
                projectTask.setValue({
                    fieldId: 'custevent_kantata_task_id',
                    value: kantataValue
                });
                projectTask.save();
                log.audit('Project Task Updated', 'ID: ' + internalId + ', Kantata: ' + kantataValue);
            } catch (e) {
                log.error('Error Updating Project Task', e.toString());
            }
        }

        function summarize(summary) {
            log.audit('Map/Reduce Script Completed', 'Summary: ' + JSON.stringify(summary));
            if (summary.inputSummary.error) {
                log.error('Input Error', summary.inputSummary.error);
            }
            summary.mapSummary.errors.iterator().each(function (key, error) {
                log.error('Map Error for key: ' + key, error);
                return true;
            });
        }

        return {
            getInputData: getInputData,
            map: map,
            summarize: summarize
        };
    });
