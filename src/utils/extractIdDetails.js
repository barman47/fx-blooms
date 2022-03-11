import { ID_FIELDS } from './constants';

const { 
    EXPIRY_DATE, 
    ISSUE_DATE, 
    DOCUMENT_NUMBER, 
    DOCUMENT_TYPE, 
    ISSUE_COUNTRY,
    DATE_OF_BIRTH,
    FIRST_NAME,
    LAST_NAME
} = ID_FIELDS;

const extractIdDetails = (data, idDetails) => {
    const customerData = { ...idDetails };
    data.forEach(item => {
        switch (item.category) {
            case EXPIRY_DATE:
                customerData.expiryDate = item.content;
                break;

            case ISSUE_DATE:
                customerData.dateOfIssue = item.content;
                break;
            
            case DOCUMENT_NUMBER:
                customerData.documentNumber = item.content;
                break;

            case DOCUMENT_TYPE:
                customerData.documentType = item.content;
                break;

            case ISSUE_COUNTRY:
                customerData.issueCountry = item.content;
                break;

            case DATE_OF_BIRTH:
                customerData.dateOfBirth = item.content;
                break;

            case FIRST_NAME:
                customerData.firstName = item.content;
                break;

            case LAST_NAME:
                customerData.lastName = item.content;
                break;

            default:
                break;
        }
    });
    
    return customerData;
};

export default extractIdDetails;