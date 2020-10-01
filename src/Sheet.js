var Sheet = function(event)
{
  this.event = event;
  
  this.ValidateEventToGeneratePaymentLinks = function()
  {
    let editedCellOldValue = this.event.oldValue;
    let editedCellNewValue = this.event.ra;

    /* EDITED CELL OLD VALUE MUST BE BLANK */
    if(!IsValueNullEmptyUndefied(editedCellOldValue))
    {
        return false;
    }

    if(!MatchWithRegx(editedCellNewValue,memberIdRegx))
    {//Toast(2);
        return false;
    }

    return true;

    // editedCellOldValue  must be blank
    // value must be matching with M{D}
    // value must be matching with the value of first column cell and active member
    // value must be pasted to first header row
    // pasted cell must be last column of the sheet
  }
}
