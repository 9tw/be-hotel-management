const { Op, literal } = require("sequelize");
const { room, booking } = require("../models");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const ExcelJS = require("exceljs");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const index = async (req, res) => {
  try {
    const bookings = await booking.findAll();

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Booking still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched bookings.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await booking.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Booking still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched booking.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckInToday = async (req, res) => {
  try {
    // Get today at 00:00
    const todayStart = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
      })
    );
    todayStart.setHours(0, 0, 0, 0);

    // Get tomorrow at 00:00
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        from: {
          [Op.gte]: todayStart,
          [Op.lt]: todayEnd,
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check In today still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in today.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckInTomorrow = async (req, res) => {
  try {
    // Get today
    const today = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
      })
    );
    today.setDate(today.getDate() + 1);

    // Get tomorrow at 00:00
    const tomorrowStart = new Date(today);
    tomorrowStart.setHours(0, 0, 0, 0);

    // Get the day after tomorrow at 00:00
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        from: {
          [Op.gte]: tomorrowStart,
          [Op.lt]: tomorrowEnd,
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check In tomorrow still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in tomorrow.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckOutToday = async (req, res) => {
  try {
    // Get today at 00:00
    const todayStart = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
      })
    );
    todayStart.setHours(0, 0, 0, 0);

    // Get tomorrow at 00:00
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        to: {
          [Op.gte]: todayStart,
          [Op.lt]: todayEnd,
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check Out today still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in today.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckOutTomorrow = async (req, res) => {
  try {
    // Get today
    const today = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tokyo",
      })
    );
    today.setDate(today.getDate() + 1);

    // Get tomorrow at 00:00
    const tomorrowStart = new Date(today);
    tomorrowStart.setHours(0, 0, 0, 0);

    // Get the day after tomorrow at 00:00
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        to: {
          [Op.gte]: tomorrowStart,
          [Op.lt]: tomorrowEnd,
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check In tomorrow still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in tomorrow.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckOutToday = async (req, res) => {
  try {
    // Get today at 00:00
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get tomorrow at 00:00
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        to: {
          [Op.gte]: todayStart, // from >= today 00:00
          [Op.lt]: todayEnd, // from < tomorrow 00:00
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check Out today still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in today.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckOutTomorrow = async (req, res) => {
  try {
    // Get today
    const today = new Date();
    today.setDate(today.getDate() + 1);

    // Get tomorrow at 00:00
    const tomorrowStart = new Date(today);
    tomorrowStart.setHours(0, 0, 0, 0);

    // Get the day after tomorrow at 00:00
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        to: {
          [Op.gte]: tomorrowStart, // from >= tomorrow 00:00
          [Op.lt]: tomorrowEnd, // from < the day after tomorrow 00:00
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Check In tomorrow still empty.",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched check in tomorrow.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getBookingToday = async (req, res) => {
  try {
    const { view, search, from, to } = req.query;
    let { page, limit } = req.query;
    let bookings;
    let counts;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;
    const filterFrom = new Date(from);
    const filterTo = new Date(to);

    if (view === "list") {
      const today = new Date();

      if (search && from != "null" && to != "null") {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            name: { [Op.iLike]: `%${search}%` },
            [Op.or]: [
              { from: { [Op.between]: [filterFrom, filterTo] } },
              { to: { [Op.between]: [filterFrom, filterTo] } },
              {
                from: { [Op.lte]: filterFrom },
                to: { [Op.gte]: filterTo },
              },
            ],
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      } else if (search === `` && from != undefined && to != undefined) {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            [Op.or]: [
              { from: { [Op.between]: [filterFrom, filterTo] } },
              { to: { [Op.between]: [filterFrom, filterTo] } },
              {
                from: { [Op.lte]: filterFrom },
                to: { [Op.gte]: filterTo },
              },
            ],
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      } else if (search) {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            name: { [Op.iLike]: `%${search}%` },
            from: { [Op.lte]: today }, // from ≤ today
            to: { [Op.gte]: today }, // to ≥ today
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      } else {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            from: { [Op.lte]: today }, // from ≤ today
            to: { [Op.gte]: today }, // to ≥ today
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      }

      if (!bookings || bookings.length === 0) {
        return res.status(200).send({
          message: "Booking still empty",
          result: [],
          pagination: {
            total: counts,
            page,
            limit,
            totalPages: Math.ceil(counts / limit),
          },
        });
      }

      return res.status(200).send({
        message: "Sucessfully fetched bookings.",
        result: bookings,
        pagination: {
          total: counts,
          page,
          limit,
          totalPages: Math.ceil(counts / limit),
        },
      });
    } else if (view === "table") {
      if (from && to) {
        // 1. Fetch all rooms with overlapping bookings
        const rooms = await room.findAll({
          where: {
            id: { [Op.ne]: 0 },
          },
          order: [["id", "ASC"]],
          include: [
            {
              model: booking,
              as: "bookings",
              where: {
                [Op.or]: [
                  { from: { [Op.between]: [filterFrom, filterTo] } },
                  { to: { [Op.between]: [filterFrom, filterTo] } },
                  {
                    from: { [Op.lte]: filterFrom },
                    to: { [Op.gte]: filterTo },
                  },
                ],
              },
              required: false,
              attributes: ["id", "name", "from", "to"],
            },
          ],
        });

        // 2. Generate dates in range
        function getDatesBetween(start, end) {
          const dates = [];
          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return dates;
        }

        const dates = getDatesBetween(filterFrom, filterTo);

        // 3. Build result grouped by date
        const result = dates.map((d) => {
          const dayString = d.toISOString().split("T")[0]; // YYYY-MM-DD
          return {
            date: dayString,
            rooms: rooms.map((r) => {
              const bookingsForDay = r.bookings.filter(
                (b) => new Date(b.from) <= d && new Date(b.to) > d
              );
              return {
                id: r.id,
                name: r.name,
                bookings: bookingsForDay,
                status: r.status,
              };
            }),
          };
        });

        bookings = result;
      } else {
        const today = new Date();
        bookings = await room.findAll({
          where: {
            id: { [Op.ne]: 0 },
          },
          order: [["id", "ASC"]],
          include: [
            {
              model: booking,
              as: "bookings", // alias must match your association
              where: {
                from: { [Op.lte]: today },
                to: { [Op.gte]: today },
              },
              required: false, // 👈 so rooms without bookings still appear
              attributes: ["id", "name", "from", "to"],
            },
          ],
        });
      }

      if (!bookings || bookings.length === 0) {
        return res.status(200).send({
          message: "Booking still empty",
          result: [],
        });
      }

      return res.status(200).send({
        message: "Sucessfully fetched bookings.",
        result: bookings,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getPrint = async (req, res) => {
  try {
    const { id, format } = req.query;
    const bookings = await booking.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Booking still empty",
        result: [],
      });
    }

    if (format === "invoice") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Booking Data");

      worksheet.addRow(["Arbiru Beach Resort"]).font = {
        bold: true,
        size: 16,
        color: { argb: "FF00008B" },
      };
      worksheet.mergeCells("A1:K1");
      worksheet.addRow(["Bebonuk, Aldeia Meti I"]);
      worksheet.mergeCells("A2:K2");
      worksheet.addRow(["Comoro, East Timor"]);
      worksheet.mergeCells("A3:K3");
      worksheet.addRow(["Tel: (+670) 7751 3024 / 7726 3642"]).font = {
        color: { argb: "FF00008B" },
      };
      worksheet.mergeCells("A4:K4");
      worksheet.addRow(["www.arbiruhotel.com"]).font = {
        color: { argb: "FF00008B" },
      };

      // Add image
      const imageId = workbook.addImage({
        filename: path.join(__dirname, "..", "logo-arbiru.png"),
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 3, row: 0 },
        br: { col: 4, row: 5 },
      });
      worksheet.mergeCells("A5:K5");
      worksheet.mergeCells("A6:K6");

      worksheet.addRow(["", "", "", "", "", "", "", "SHORT TERM", "", ""]);
      worksheet.getRow(7).getCell(8).font = {
        bold: true,
        size: 16,
        color: { argb: "FF00008B" },
      };
      worksheet.mergeCells("H7:I7");

      worksheet.addRow([
        "Client:",
        bookings.name,
        "",
        "",
        "",
        "",
        "Invoice No:",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B8:E8");
      worksheet.mergeCells("H8:K8");

      worksheet.addRow([
        "Company:",
        "",
        "",
        "",
        "",
        "",
        "Room No:",
        bookings.room.name,
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B9:E9");
      worksheet.mergeCells("H9:K9");

      worksheet.addRow([
        "Email:",
        "",
        "",
        "",
        "",
        "",
        "Month Of:",
        moment(bookings.from).format("MMMM"),
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B10:E10");
      worksheet.mergeCells("H10:K10");

      worksheet.addRow([
        "Mobile:",
        "",
        "",
        "",
        "",
        "",
        "Sales Person:",
        bookings.created_by,
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B11:E11");
      worksheet.mergeCells("H11:K11");

      worksheet.addRow([
        "Date:",
        moment(Date.now()).format("ddd, DD MMM YYYY"),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B12:E12");

      worksheet.mergeCells("A13:K13");

      worksheet.addRow([
        "Type",
        "",
        "",
        "Description",
        "",
        "",
        "Qty",
        "Nights",
        "Price",
        "Total",
        "",
      ]);
      worksheet.mergeCells("A14:C14");
      worksheet.mergeCells("D14:F14");
      worksheet.mergeCells("J14:K14");

      const fromDate = moment(bookings.from);
      const toDate = moment(bookings.to);
      const nights = toDate.diff(fromDate, "days");
      const price = bookings.price;
      const total = nights * price;

      worksheet.addRow([
        "Single Apartment",
        "",
        "",
        bookings.notes,
        "",
        "",
        1,
        nights,
        price,
        total,
        "",
      ]);
      worksheet.mergeCells("A15:C15");
      worksheet.mergeCells("D15:F15");
      worksheet.mergeCells("J15:K15");

      worksheet.mergeCells("A16:C16");
      worksheet.mergeCells("D16:F16");
      worksheet.mergeCells("J16:K16");

      worksheet.mergeCells("A17:C17");
      worksheet.mergeCells("D17:F17");
      worksheet.mergeCells("J17:K17");

      worksheet.mergeCells("A18:C18");
      worksheet.mergeCells("D18:F18");
      worksheet.mergeCells("J18:K18");

      worksheet.addRow([
        "Rental Period:",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Sub Total:",
        total,
        "",
      ]);
      worksheet.mergeCells("A19:C19");
      worksheet.mergeCells("J19:K19");

      worksheet.addRow([
        "Commencement Date:",
        "",
        "",
        moment(bookings.from).format("ddd, DD MMM YYYY"),
        "",
        "",
        "",
        "",
        "DP:",
        0,
        "",
      ]);
      worksheet.mergeCells("A20:C20");
      worksheet.mergeCells("D20:F20");
      worksheet.mergeCells("J20:K20");

      worksheet.addRow([
        "Expiry Date & Check Out:",
        "",
        "",
        moment(bookings.to).format("ddd, DD MMM YYYY"),
        "",
        "",
        "",
        "",
        "Balance Due:",
        0,
        "",
      ]);
      worksheet.mergeCells("A21:C21");
      worksheet.mergeCells("D21:F21");
      worksheet.mergeCells("J21:K21");

      worksheet.mergeCells("A22:K22");

      // Apply alignment and fill to the merged cell
      const clientCells = [
        "B8",
        "H8",
        "B9",
        "H9",
        "B10",
        "H10",
        "B11",
        "H11",
        "B12",
        "A20",
        "A21",
        "D20",
        "D21",
      ];
      clientCells.forEach((cell) => {
        const cel = worksheet.getCell(cell);
        cel.alignment = {
          vertical: "middle",
        };
        cel.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" },
        };
      });

      // Apply alignment and fill to the merged cell
      const totalCells = ["J19", "J20", "J21"];
      totalCells.forEach((cell) => {
        const cel = worksheet.getCell(cell);
        cel.alignment = {
          vertical: "middle",
        };
        cel.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF969696" },
        };
      });

      worksheet.addRow(["Payment Details"]).font = {
        bold: true,
      };
      worksheet.mergeCells("A23:F23");

      worksheet.addRow([
        "Can be by direct cash to Arbiru Office or Bank Transfer:",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A24:F24");

      worksheet.addRow([
        "MANDIRI BANK",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A25:F25");

      worksheet.addRow([
        "Arbiru Beach Resort, Unipessoal Lda",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A26:F26");

      worksheet.addRow([
        "No.Rek : 601-00-0094990-2",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A27:F27");

      worksheet.addRow([
        "N.Iban : TL380050601000094990259",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A28:F28");

      worksheet.mergeCells("A29:K29");

      worksheet.addRow(["Cancelation Policy"]).font = {
        bold: true,
      };
      worksheet.mergeCells("A30:K30");

      worksheet.addRow([
        "1. Additional person will be charge as additional bill.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A31:K31");

      worksheet.addRow([
        "2. Hotel will not hold the above function and room if no deposit or definite confirmation received.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A32:K32");

      worksheet.addRow([
        "3. Cancelation event one day before will be charge 50% for Cancelation Policy.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A33:K33");

      worksheet.addRow([
        "4. Cancelation event on that day, hotel will charge full ( 100% ) for Cancelation Policy.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("A34:K34");

      worksheet.mergeCells("A35:K35");
      worksheet.mergeCells("A36:K36");
      worksheet.mergeCells("A37:K37");
      worksheet.mergeCells("A38:K38");

      worksheet.addRow([
        "",
        "Cashier's Signature",
        "",
        "",
        "",
        "",
        "Customer's Signature",
        "",
        "",
        "",
        "",
      ]);
      worksheet.mergeCells("B39:E39");
      worksheet.mergeCells("G39:J39");

      // Apply alignment and fill to the merged cell
      const signCells = ["B39", "G39"];
      signCells.forEach((cell) => {
        const cel = worksheet.getCell(cell);
        cel.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });

      worksheet.mergeCells("A40:K40");

      worksheet.addRow([
        "Thankyou for choosing Arbiru Beach Resort for your stay and see you again!",
      ]).font = {
        bold: true,
      };
      worksheet.mergeCells("A41:K41");

      // Apply alignment and fill to the merged cell
      const informationCells = [
        "A15",
        "A16",
        "A17",
        "A18",
        "D15",
        "D16",
        "D17",
        "D18",
        "G15",
        "G16",
        "G17",
        "G18",
        "H15",
        "H16",
        "H17",
        "H18",
        "I15",
        "I16",
        "I17",
        "I18",
        "J15",
        "J16",
        "J17",
        "J18",
        "A23",
        "A30",
      ];
      informationCells.forEach((cell) => {
        const cel = worksheet.getCell(cell);
        cel.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cel.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" },
        };
      });

      // Apply alignment and fill to the merged cell
      const headerCells = [
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A14",
        "D14",
        "G14",
        "H14",
        "I14",
        "J14",
        "A41",
      ];
      headerCells.forEach((cell) => {
        const cel = worksheet.getCell(cell);
        cel.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cel.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" },
        };
      });

      const cell1 = worksheet.getCell(1, 1);
      cell1.border = {
        left: { style: "thin" },
        top: { style: "thin" },
        right: { style: "thin" },
      };

      for (let row = 2; row <= 5; row++) {
        const cell = worksheet.getCell(row, 1);
        cell.border = {
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }

      const cell2 = worksheet.getCell(6, 1);
      cell2.border = {
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      for (let row = 7; row <= 12; row++) {
        const cell = worksheet.getCell(row, 1);
        cell.border = {
          left: { style: "thin" },
        };
      }

      const cell3 = worksheet.getCell(7, 11);
      cell3.border = {
        right: { style: "thin" },
      };

      for (let row = 8; row <= 12; row++) {
        for (let col = 1; col <= 11; col++) {
          if (col === 2 || (col === 8 && row != 12)) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
              left: { style: "thin" },
              top: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            };
          }
        }
      }

      const cell4 = worksheet.getCell(12, 11);
      cell4.border = {
        right: { style: "thin" },
      };

      const cell5 = worksheet.getCell(13, 1);
      cell5.border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };

      for (let row = 14; row <= 18; row++) {
        for (let col = 1; col <= 11; col++) {
          const cell = worksheet.getCell(row, col);
          cell.border = {
            left: { style: "thin" },
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };
        }
      }

      for (let row = 19; row <= 21; row++) {
        const cell = worksheet.getCell(row, 1);
        cell.border = {
          left: { style: "thin" },
        };
      }

      for (let row = 19; row <= 21; row++) {
        for (let col = 4; col <= 11; col++) {
          if (col === 10 || (col === 4 && row != 19)) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
              left: { style: "thin" },
              top: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            };
          }
        }
      }

      const cell6 = worksheet.getCell(22, 1);
      cell6.border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };

      for (let row = 23; row <= 34; row++) {
        if (row != 29) {
          const cell = worksheet.getCell(row, 1);
          cell.border = {
            left: { style: "thin" },
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };
        }
      }

      for (let row = 23; row <= 28; row++) {
        const cell = worksheet.getCell(row, 11);
        cell.border = {
          right: { style: "thin" },
        };
      }

      const cell7 = worksheet.getCell(29, 1);
      cell7.border = {
        left: { style: "thin" },
        right: { style: "thin" },
      };

      for (let row = 35; row <= 40; row++) {
        if (row != 39) {
          const cell = worksheet.getCell(row, 1);
          cell.border = {
            left: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      const cell8 = worksheet.getCell(39, 1);
      cell8.border = {
        left: { style: "thin" },
      };

      const cell9 = worksheet.getCell(39, 11);
      cell9.border = {
        right: { style: "thin" },
      };

      for (let col = 1; col <= 11; col++) {
        if (col === 2 || col === 7) {
          const cell = worksheet.getCell(39, col);
          cell.border = {
            top: { style: "thin" },
          };
        }
      }

      const cell10 = worksheet.getCell(41, 1);
      cell10.border = {
        left: { style: "thin" },
        top: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=invoice.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      const logo = await pdfDoc.embedPng(
        fs.readFileSync(path.join(__dirname, "..", "logo-arbiru.png"))
      );

      // Embed standard font (Helvetica - built-in, no external files needed)
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

      // Add a landscape page (A4 landscape: 841.89 x 595.28 points)
      const pageWidth = 841.89;
      const pageHeight = 595.28;
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      if (logo) {
        // Scale image to fit the page
        const imageDims = logo.scaleToFit(pageWidth, pageHeight);

        // Center the image on the page
        const x = (pageWidth - imageDims.width) / 2;
        const y = (pageHeight - imageDims.height) / 2;

        // Draw as background
        page.drawImage(logo, {
          x: x,
          y: y,
          width: imageDims.width,
          height: imageDims.height,
          opacity: 0.2,
        });
      }

      // Set page margins (adjusted for landscape)
      const margin = 50;
      let yPosition = pageHeight - 100;

      const titleText = "WELCOME TO";
      const titleWidth = helveticaFont.widthOfTextAtSize(titleText, 42);
      const titleX = (pageWidth - titleWidth) / 2;
      page.drawText(titleText, {
        x: titleX,
        y: yPosition,
        size: 42,
        font: helveticaFont,
        color: rgb(0, 0.5, 0.8), // Blue color
      });
      yPosition -= 40;

      const titleText2 = "ARBIRU BEACH RESORT";
      const titleWidth2 = helveticaFont.widthOfTextAtSize(titleText2, 42);
      const titleXX = (pageWidth - titleWidth2) / 2;
      page.drawText(titleText2, {
        x: titleXX,
        y: yPosition,
        size: 42,
        font: helveticaFont,
        color: rgb(0, 0.5, 0.8), // Blue color
      });
      yPosition -= 40;

      const titleText3 = "DILI - TIMOR LESTE";
      const titleWidth3 = helveticaFont.widthOfTextAtSize(titleText3, 42);
      const titleXXX = (pageWidth - titleWidth3) / 2;
      page.drawText(titleText3, {
        x: titleXXX,
        y: yPosition,
        size: 42,
        font: helveticaFont,
        color: rgb(0, 0.5, 0.8), // Blue color
      });
      yPosition -= 150;

      // Guest Name
      const subtitleText = bookings.name;
      const subtitleLines = wrapText(
        subtitleText,
        helveticaBoldFont,
        100,
        pageWidth - 2 * margin
      );
      for (const line of subtitleLines) {
        const lineWidth = helveticaBoldFont.widthOfTextAtSize(line, 100);
        const x = (pageWidth - lineWidth) / 2;
        drawTextWithOutline(
          page,
          line,
          x,
          yPosition,
          helveticaBoldFont,
          100,
          rgb(255 / 255, 191 / 255, 0 / 255), // yellow color
          rgb(0, 0, 0),
          3
        );
        yPosition -= 100;
      }

      // Information
      const infoText =
        moment(bookings.from).format("ddd, DD MMM YYYY") +
        `: ${bookings.notes}`;
      const infoWidth = helveticaBoldFont.widthOfTextAtSize(infoText, 16);
      const infoX = (pageWidth - infoWidth) / 2;
      page.drawText(infoText, {
        x: infoX,
        y: yPosition,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0.5, 0.5, 0.5), // grey color
      });

      const pdfBytes = await pdfDoc.save();
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=pickup-docs.pdf",
      });
      res.end(Buffer.from(pdfBytes));
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { ...other } = req.body;

    const data = await booking.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created booking.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...other } = req.body;

    const data = await booking.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Booking not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated booking.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await booking.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted booking.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Helper function to wrap text into lines that fit the page width
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper function to draw text with outline effect
function drawTextWithOutline(
  page,
  text,
  x,
  y,
  font,
  fontSize,
  mainColor,
  outlineColor,
  outlineThickness
) {
  // Draw outline by offsetting the text in multiple directions
  const offsets = [
    { x: -outlineThickness, y: 0 },
    { x: outlineThickness, y: 0 },
    { x: 0, y: -outlineThickness },
    { x: 0, y: outlineThickness },
    { x: -outlineThickness, y: -outlineThickness },
    { x: -outlineThickness, y: outlineThickness },
    { x: outlineThickness, y: -outlineThickness },
    { x: outlineThickness, y: outlineThickness },
  ];

  // Draw outline strokes
  for (const offset of offsets) {
    page.drawText(text, {
      x: x + offset.x,
      y: y + offset.y,
      size: fontSize,
      font: font,
      color: outlineColor,
    });
  }

  // Draw main text on top
  page.drawText(text, {
    x: x,
    y: y,
    size: fontSize,
    font: font,
    color: mainColor,
  });
}

module.exports = {
  index,
  create,
  update,
  destroy,
  getBookingById,
  getCheckInToday,
  getCheckInTomorrow,
  getCheckOutToday,
  getCheckOutTomorrow,
  getBookingToday,
  getPrint,
};
