import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Data.css';

const TablePage = () => {
    const initialData = [
        {
            id: 1,
            startDate: '',
            endDate: '',
            months: 0,
            excludedDates: [],
            days: 0,
            leadCount: '',
            expectedDRR: 0,
            lastUpdated: 'Buttons',
            lastUpdatedTimestamp: null,
            isSaved: false,
        },
    ];

    const [tableData, setTableData] = useState(initialData);
    const [nextId, setNextId] = useState(2);
    const [rowInputData, setRowInputData] = useState({
        startDate: null,
        endDate: null,
        leadCount: 0,
    });

    const calculateMonthsBetween = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return 0;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return months;
    };

    const calculateDaysBetween = (startDate, endDate, excludedDates) => {
        if (!startDate || !endDate) {
            return 0;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const oneDay = 24 * 60 * 60 * 1000; 
        let days = Math.round((end - start) / oneDay) + 1; 

        // Exclude the specified dates
        if (excludedDates.length > 0) {
            excludedDates.forEach((excludedDate) => {
                const excluded = new Date(excludedDate);
                if (excluded >= start && excluded <= end) {
                    days--;
                }
            });
        }

        return days;
    };

    const handleStartDateChange = (date) => {
        setRowInputData({ ...rowInputData, startDate: date });
    };

    const handleEndDateChange = (date) => {
        if (rowInputData.startDate && date < rowInputData.startDate) {
            return;
        }
        setRowInputData({ ...rowInputData, endDate: date });
    };

    const handleExcludedDatesChange = (value, rowId) => {
        const updatedTableData = tableData.map((row) => {
            if (row.id === rowId) {
                return { ...row, excludedDates: value.split(',').map((date) => date.trim()) };
            }
            return row;
        });

        setTableData(updatedTableData);
    };

    const handleLeadCountChange = (value, rowId) => {
        const updatedTableData = tableData.map((row) => {
            if (row.id === rowId) {
                return { ...row, leadCount: parseInt(value, 10) };
            }
            return row;
        });

        setTableData(updatedTableData);
    };

    const handleSaveButtonClick = (rowId) => {
        const updatedTableData = tableData.map((row) => {
            if (row.id === rowId) {
                const months = calculateMonthsBetween(rowInputData.startDate, rowInputData.endDate);
                const days = calculateDaysBetween(rowInputData.startDate, rowInputData.endDate, row.excludedDates);
                const expectedDRR = days !== 0 ? row.leadCount / days : 0;

                return {
                    ...row,
                    isSaved: true,
                    months,
                    days,
                    expectedDRR,
                    lastUpdatedTimestamp: new Date(),
                };
            }
            return row;
        });

        setTableData(updatedTableData);
    };

    const handleCancel = (rowId) => {
        const updatedTableData = tableData.filter((row) => row.id !== rowId);
        setTableData(updatedTableData);
    };

    const addNewRow = () => {
        const newRow = {
            id: nextId,
            startDate: rowInputData.startDate,
            endDate: rowInputData.endDate,
            months: 0,
            excludedDates: [],
            days: 0,
            leadCount: rowInputData.leadCount,
            expectedDRR: 0,
            lastUpdated: 'Buttons',
            lastUpdatedTimestamp: null,
            isSaved: false,
        };

        setTableData([...tableData, newRow]);
        setNextId(nextId + 1);
    };

    return (
        <div>
            <h1>Daily Run Rate</h1>
        <div className="table-container">
            <button onClick={addNewRow} className='button-1'>Add new</button>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Months</th>
                        <th>Dates Excluded (YY/MM/DD,..)</th>
                        <th>Number of Days</th>
                        <th>Lead Count</th>
                        <th>Expected DRR</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                                <DatePicker
                                    placeholderText='enter start date'
                                    selected={rowInputData.startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    disabled={row.isSaved}
                                    className={row.isSaved ? 'saved-datepicker' : 'unsaved-datepicker'} 
                                />
                            </td>
                            <td>
                                <DatePicker
                                    placeholderText='enter end date'
                                    selected={rowInputData.endDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    disabled={row.isSaved}
                                    className={row.isSaved ? 'saved-datepicker' : 'unsaved-datepicker'}
                                />
                            </td>
                            <td>{row.months}</td>
                            <td>
                                <textarea
                                    placeholder='enter dates to be excluded'
                                    value={row.excludedDates.join(', ')}
                                    onChange={(e) => handleExcludedDatesChange(e.target.value, row.id)}
                                    readOnly={row.isSaved}
                                    className={row.isSaved ? 'saved-textarea' : 'unsaved-textarea'} 
                                />
                            </td>
                            <td>{row.days}</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Enter Lead Count"
                                    value={row.leadCount}
                                    onChange={(e) => handleLeadCountChange(e.target.value, row.id)}
                                    readOnly={row.isSaved}
                                    className={row.isSaved ? 'saved-input' : 'unsaved-input'} 
                                />
                            </td>
                            <td>{row.isSaved ? row.expectedDRR.toFixed(1) : '-'}</td>
                            <td>
                                {row.isSaved ? (
                                    row.lastUpdatedTimestamp ? row.lastUpdatedTimestamp.toLocaleString() : 'N/A'
                                ) : (
                                    <div>
                                        <button onClick={() => handleSaveButtonClick(row.id)} className='save'>Save</button>
                                        <button onClick={() => handleCancel(row.id)} className='cancel'>Cancel</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default TablePage;
