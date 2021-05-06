import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../providers/app-provider';
import getData from '../networking/send-get-request';

const CustomTable = (tableProps) => {
    const [state, setState] = useState({
        page: 1,
        data: [],
        totalSize: 0,
        sizePerPage: 10
    });

    const {toggleSpinner} = useContext(AppContext) || {};

    useEffect(() => {
        if(tableProps.ajaxUrl) {
            refreshTableData();
        }
    }, [tableProps.ajaxUrl]);

    const getTotalSizeFromData = (responseData) => {
        let dataName = tableProps.dataName;
        let firstChar = dataName.substring(0, 1);
        let remainingCharacters = dataName.substring(1);
        return responseData[`total${(firstChar.toUpperCase() + remainingCharacters)}Count`];
    }

    const refreshTableData = (filterOpts, params) => {
        toggleSpinner("show");
        let {ajaxUrl} = tableProps;
        let andFilter = filterOpts ? (ajaxUrl + "&") : ajaxUrl;
        let optFilter = filterOpts ? (ajaxUrl + "?") : ajaxUrl;
        getData(`${ajaxUrl.includes("?") ? andFilter : optFilter}${filterOpts || ""}`)
        .then((data) => {
            if(data) {
                if(data.responseCode == 99) {
                    if(params)
                        setState({page: params.page, sizePerPage: params.sizePerPage, data: data.responseData[tableProps.dataName], totalSize: getTotalSizeFromData(data.responseData)});
                    else
                        setState({...state, data: data.responseData[tableProps.dataName], totalSize: getTotalSizeFromData(data.responseData)});
                    toggleSpinner("hide");
                }else{
                    console.log("Unable to fetch table data");
                    toggleSpinner("hide");
                }
            }else {
                console.log("Unable to fetch table data");
                toggleSpinner("hide");
            }
        });
    }

    const handleTableChange = (changeType, params) => {
        const {sortOrder, sortField, sizePerPage, searchText, page} = params;
        let filterOpts = `pageNumber=${(page - 1)}&pageSize=${sizePerPage}`;
        if(sortField) filterOpts += `&columnSortBy=${sortField}_${sortOrder}`;
        if(searchText) filterOpts += "&searchParam="+ searchText;
        setTimeout(() => {
            refreshTableData(filterOpts, params);
        }, 1000);
    }

    const defaultSorted = [{
        dataField: 'id',
        order: 'desc'
    }];

    return(
        <ToolkitProvider bootstrap4 keyField="id" data={tableProps.data ? tableProps.data : state.data} columns={tableProps.columns} search >
            {
                props => (
                <div className="w-100">
                    <Search.SearchBar className="table-search-bar" {...props.searchProps} placeholder="Search here..." />
                    <BootstrapTable {...props.baseProps} bordered={false} striped hover wrapperClasses="table-responsive" defaultSorted={defaultSorted} remote={tableProps.data ? false : true} onTableChange={tableProps.data ? () => {} : handleTableChange} pagination={!tableProps.data ? paginationFactory({showTotal: true, page: state.page, sizePerPage: state.sizePerPage, totalSize: state.totalSize}) : paginationFactory({showTotal: true})} />
                </div>
                )
            }
        </ToolkitProvider>
    );
}

export default CustomTable;