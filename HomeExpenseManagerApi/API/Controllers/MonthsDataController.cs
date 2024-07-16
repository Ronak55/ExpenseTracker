using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonthsDataController : ControllerBase
    {
        public readonly MonthsDataContext _context;

        public MonthsDataController(MonthsDataContext context)
        {
            _context = context;
        }

        // Will return list of month names with year in ascending order

        [HttpGet("GetListOfMonths")]
        public IActionResult GetListOfMonths()
        {
            var monthsList = (from x in _context.MonthsData
                              group x by new
                              {
                                  monthYear = x.MonthYear,
                                  monthNumber = x.MonthNumber,
                              } into monthsGroup
                              orderby monthsGroup.Key.monthYear.Length ascending,
                                      monthsGroup.Key.monthYear ascending,
                                      monthsGroup.Key.monthNumber.Length ascending,
                                      monthsGroup.Key.monthNumber ascending
                              select monthsGroup.Key).ToList();

        
          return Ok(monthsList);

        }

        // Will return all the rows of the specified table

        [HttpGet("GetTableData")]

        public IActionResult GetTableData(string monthYear, string monthNumber, string tableName)
        {

            var tableData = (from x in _context.MonthsData
                             where x.MonthYear == monthYear && x.MonthNumber == monthNumber && x.TableName == tableName
                             select new
                             {
                                 id = x.Id,
                                 date = x.Date,
                                 name = x.Name,
                                 amount = x.Amount,
                             }).ToList();

            return Ok(tableData);

        }

        // Insert the row into the database

        [HttpPost("InsertTableRow")]

        public IActionResult InsertTableRow(MonthsData monthsDataFromFrontEnd)
        {

            _context.MonthsData.Add(monthsDataFromFrontEnd);
            _context.SaveChanges();

            var id = _context.MonthsData.OrderByDescending(p=>p.Id).FirstOrDefault().Id;

            return Ok(id);    
        }

        // Deletes row from the db

        [HttpDelete("DeleteTableRow/{id}")]
        public IActionResult DeleteTableRow(int id)
        {
            var x = _context.MonthsData.Where(item => item.Id == id).FirstOrDefault();

            _context.MonthsData.Remove(x);

            _context.SaveChanges();

            return Ok("success");

        }
    
    }
}
