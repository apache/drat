'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Components


// Mixins


// Utils


var _VDatePickerTitle = require('./VDatePickerTitle');

var _VDatePickerTitle2 = _interopRequireDefault(_VDatePickerTitle);

var _VDatePickerHeader = require('./VDatePickerHeader');

var _VDatePickerHeader2 = _interopRequireDefault(_VDatePickerHeader);

var _VDatePickerDateTable = require('./VDatePickerDateTable');

var _VDatePickerDateTable2 = _interopRequireDefault(_VDatePickerDateTable);

var _VDatePickerMonthTable = require('./VDatePickerMonthTable');

var _VDatePickerMonthTable2 = _interopRequireDefault(_VDatePickerMonthTable);

var _VDatePickerYears = require('./VDatePickerYears');

var _VDatePickerYears2 = _interopRequireDefault(_VDatePickerYears);

var _picker = require('../../mixins/picker');

var _picker2 = _interopRequireDefault(_picker);

var _util = require('./util');

var _isDateAllowed2 = require('./util/isDateAllowed');

var _isDateAllowed3 = _interopRequireDefault(_isDateAllowed2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-date-picker',

  mixins: [_picker2.default],

  data: function data() {
    var _this = this;

    var now = new Date();
    return {
      activePicker: this.type.toUpperCase(),
      defaultColor: 'accent',
      inputDay: null,
      inputMonth: null,
      inputYear: null,
      isReversing: false,
      now: now,
      // tableDate is a string in 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
      tableDate: function () {
        if (_this.pickerDate) {
          return _this.pickerDate;
        }

        var date = _this.value || now.getFullYear() + '-' + (now.getMonth() + 1);
        var type = _this.type === 'date' ? 'month' : 'year';
        return _this.sanitizeDateString(date, type);
      }()
    };
  },


  props: {
    allowedDates: Function,
    // Function formatting the day in date picker table
    dayFormat: {
      type: Function,
      default: null
    },
    events: {
      type: [Array, Object, Function],
      default: function _default() {
        return null;
      }
    },
    eventColor: {
      type: [String, Function, Object],
      default: 'warning'
    },
    firstDayOfWeek: {
      type: [String, Number],
      default: 0
    },
    // Function formatting the tableDate in the day/month table header
    headerDateFormat: {
      type: Function,
      default: null
    },
    locale: {
      type: String,
      default: 'en-us'
    },
    max: String,
    min: String,
    // Function formatting month in the months table
    monthFormat: {
      type: Function,
      default: null
    },
    nextIcon: {
      type: String,
      default: 'chevron_right'
    },
    pickerDate: String,
    prevIcon: {
      type: String,
      default: 'chevron_left'
    },
    reactive: Boolean,
    readonly: Boolean,
    scrollable: Boolean,
    showCurrent: {
      type: [Boolean, String],
      default: true
    },
    // Function formatting currently selected date in the picker title
    titleDateFormat: {
      type: Function,
      default: null
    },
    type: {
      type: String,
      default: 'date',
      validator: function validator(type) {
        return ['date', 'month'].includes(type);
      } // TODO: year
    },
    value: String,
    // Function formatting the year in table header and pickup title
    yearFormat: {
      type: Function,
      default: null
    },
    yearIcon: String
  },

  computed: {
    current: function current() {
      if (this.showCurrent === true) {
        return this.sanitizeDateString(this.now.getFullYear() + '-' + (this.now.getMonth() + 1) + '-' + this.now.getDate(), this.type);
      }

      return this.showCurrent || null;
    },
    inputDate: function inputDate() {
      return this.type === 'date' ? this.inputYear + '-' + (0, _util.pad)(this.inputMonth + 1) + '-' + (0, _util.pad)(this.inputDay) : this.inputYear + '-' + (0, _util.pad)(this.inputMonth + 1);
    },
    tableMonth: function tableMonth() {
      return (this.pickerDate || this.tableDate).split('-')[1] - 1;
    },
    tableYear: function tableYear() {
      return (this.pickerDate || this.tableDate).split('-')[0] * 1;
    },
    minMonth: function minMonth() {
      return this.min ? this.sanitizeDateString(this.min, 'month') : null;
    },
    maxMonth: function maxMonth() {
      return this.max ? this.sanitizeDateString(this.max, 'month') : null;
    },
    minYear: function minYear() {
      return this.min ? this.sanitizeDateString(this.min, 'year') : null;
    },
    maxYear: function maxYear() {
      return this.max ? this.sanitizeDateString(this.max, 'year') : null;
    },
    formatters: function formatters() {
      return {
        year: this.yearFormat || (0, _util.createNativeLocaleFormatter)(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 }),
        titleDate: this.titleDateFormat || this.defaultTitleDateFormatter
      };
    },
    defaultTitleDateFormatter: function defaultTitleDateFormatter() {
      var titleFormats = {
        year: { year: 'numeric', timeZone: 'UTC' },
        month: { month: 'long', timeZone: 'UTC' },
        date: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }
      };

      var titleDateFormatter = (0, _util.createNativeLocaleFormatter)(this.locale, titleFormats[this.type], {
        start: 0,
        length: { date: 10, month: 7, year: 4 }[this.type]
      });

      var landscapeFormatter = function landscapeFormatter(date) {
        return titleDateFormatter(date).replace(/([^\d\s])([\d])/g, function (match, nonDigit, digit) {
          return nonDigit + ' ' + digit;
        }).replace(', ', ',<br>');
      };

      return this.landscape ? landscapeFormatter : titleDateFormatter;
    }
  },

  watch: {
    tableDate: function tableDate(val, prev) {
      // Make a ISO 8601 strings from val and prev for comparision, otherwise it will incorrectly
      // compare for example '2000-9' and '2000-10'
      var sanitizeType = this.type === 'month' ? 'year' : 'month';
      this.isReversing = this.sanitizeDateString(val, sanitizeType) < this.sanitizeDateString(prev, sanitizeType);
      this.$emit('update:pickerDate', val);
    },
    pickerDate: function pickerDate(val) {
      if (val) {
        this.tableDate = val;
      } else if (this.value && this.type === 'date') {
        this.tableDate = this.sanitizeDateString(this.value, 'month');
      } else if (this.value && this.type === 'month') {
        this.tableDate = this.sanitizeDateString(this.value, 'year');
      }
    },
    value: function value() {
      this.setInputDate();
      if (this.value && !this.pickerDate) {
        this.tableDate = this.sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
      }
    },
    type: function type(_type) {
      this.activePicker = _type.toUpperCase();

      if (this.value) {
        var date = this.sanitizeDateString(this.value, _type);
        this.$emit('input', this.isDateAllowed(date) ? date : null);
      }
    }
  },

  methods: {
    isDateAllowed: function isDateAllowed(value) {
      return (0, _isDateAllowed3.default)(value, this.min, this.max, this.allowedDates);
    },
    yearClick: function yearClick(value) {
      this.inputYear = value;
      if (this.type === 'month') {
        this.tableDate = '' + value;
      } else {
        this.tableDate = value + '-' + (0, _util.pad)(this.tableMonth + 1);
      }
      this.activePicker = 'MONTH';
      this.reactive && this.isDateAllowed(this.inputDate) && this.$emit('input', this.inputDate);
    },
    monthClick: function monthClick(value) {
      this.inputYear = parseInt(value.split('-')[0], 10);
      this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
      if (this.type === 'date') {
        this.tableDate = value;
        this.activePicker = 'DATE';
        this.reactive && this.isDateAllowed(this.inputDate) && this.$emit('input', this.inputDate);
      } else {
        this.$emit('input', this.inputDate);
        this.$emit('change', this.inputDate);
      }
    },
    dateClick: function dateClick(value) {
      this.inputYear = parseInt(value.split('-')[0], 10);
      this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
      this.inputDay = parseInt(value.split('-')[2], 10);
      this.$emit('input', this.inputDate);
      this.$emit('change', this.inputDate);
    },
    genPickerTitle: function genPickerTitle() {
      var _this2 = this;

      return this.$createElement(_VDatePickerTitle2.default, {
        props: {
          date: this.value ? this.formatters.titleDate(this.value) : '',
          selectingYear: this.activePicker === 'YEAR',
          year: this.formatters.year('' + this.inputYear),
          yearIcon: this.yearIcon,
          value: this.value
        },
        slot: 'title',
        style: this.readonly ? {
          'pointer-events': 'none'
        } : undefined,
        on: {
          'update:selectingYear': function updateSelectingYear(value) {
            return _this2.activePicker = value ? 'YEAR' : _this2.type.toUpperCase();
          }
        }
      });
    },
    genTableHeader: function genTableHeader() {
      var _this3 = this;

      return this.$createElement(_VDatePickerHeader2.default, {
        props: {
          nextIcon: this.nextIcon,
          color: this.color,
          disabled: this.readonly,
          format: this.headerDateFormat,
          locale: this.locale,
          min: this.activePicker === 'DATE' ? this.minMonth : this.minYear,
          max: this.activePicker === 'DATE' ? this.maxMonth : this.maxYear,
          prevIcon: this.prevIcon,
          value: this.activePicker === 'DATE' ? this.tableYear + '-' + (0, _util.pad)(this.tableMonth + 1) : '' + this.tableYear
        },
        on: {
          toggle: function toggle() {
            return _this3.activePicker = _this3.activePicker === 'DATE' ? 'MONTH' : 'YEAR';
          },
          input: function input(value) {
            return _this3.tableDate = value;
          }
        }
      });
    },
    genDateTable: function genDateTable() {
      var _this4 = this;

      return this.$createElement(_VDatePickerDateTable2.default, {
        props: {
          allowedDates: this.allowedDates,
          color: this.color,
          current: this.current,
          disabled: this.readonly,
          events: this.events,
          eventColor: this.eventColor,
          firstDayOfWeek: this.firstDayOfWeek,
          format: this.dayFormat,
          locale: this.locale,
          min: this.min,
          max: this.max,
          tableDate: this.tableYear + '-' + (0, _util.pad)(this.tableMonth + 1),
          scrollable: this.scrollable,
          value: this.value
        },
        ref: 'table',
        on: {
          input: this.dateClick,
          tableDate: function tableDate(value) {
            return _this4.tableDate = value;
          }
        }
      });
    },
    genMonthTable: function genMonthTable() {
      var _this5 = this;

      return this.$createElement(_VDatePickerMonthTable2.default, {
        props: {
          allowedDates: this.type === 'month' ? this.allowedDates : null,
          color: this.color,
          current: this.current ? this.sanitizeDateString(this.current, 'month') : null,
          disabled: this.readonly,
          format: this.monthFormat,
          locale: this.locale,
          min: this.minMonth,
          max: this.maxMonth,
          scrollable: this.scrollable,
          value: !this.value || this.type === 'month' ? this.value : this.value.substr(0, 7),
          tableDate: '' + this.tableYear
        },
        ref: 'table',
        on: {
          input: this.monthClick,
          tableDate: function tableDate(value) {
            return _this5.tableDate = value;
          }
        }
      });
    },
    genYears: function genYears() {
      return this.$createElement(_VDatePickerYears2.default, {
        props: {
          color: this.color,
          format: this.yearFormat,
          locale: this.locale,
          min: this.minYear,
          max: this.maxYear,
          value: '' + this.tableYear
        },
        on: {
          input: this.yearClick
        }
      });
    },
    genPickerBody: function genPickerBody() {
      var children = this.activePicker === 'YEAR' ? [this.genYears()] : [this.genTableHeader(), this.activePicker === 'DATE' ? this.genDateTable() : this.genMonthTable()];

      return this.$createElement('div', {
        key: this.activePicker,
        style: this.readonly ? {
          'pointer-events': 'none'
        } : undefined
      }, children);
    },

    // Adds leading zero to month/day if necessary, returns 'YYYY' if type = 'year',
    // 'YYYY-MM' if 'month' and 'YYYY-MM-DD' if 'date'
    sanitizeDateString: function sanitizeDateString(dateString, type) {
      var _dateString$split = dateString.split('-'),
          _dateString$split2 = _slicedToArray(_dateString$split, 3),
          year = _dateString$split2[0],
          _dateString$split2$ = _dateString$split2[1],
          month = _dateString$split2$ === undefined ? 1 : _dateString$split2$,
          _dateString$split2$2 = _dateString$split2[2],
          date = _dateString$split2$2 === undefined ? 1 : _dateString$split2$2;

      return (year + '-' + (0, _util.pad)(month) + '-' + (0, _util.pad)(date)).substr(0, { date: 10, month: 7, year: 4 }[type]);
    },
    setInputDate: function setInputDate() {
      if (this.value) {
        var array = this.value.split('-');
        this.inputYear = parseInt(array[0], 10);
        this.inputMonth = parseInt(array[1], 10) - 1;
        if (this.type === 'date') {
          this.inputDay = parseInt(array[2], 10);
        }
      } else {
        this.inputYear = this.inputYear || this.now.getFullYear();
        this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.getMonth();
        this.inputDay = this.inputDay || this.now.getDate();
      }
    }
  },

  created: function created() {
    if (this.pickerDate !== this.tableDate) {
      this.$emit('update:pickerDate', this.tableDate);
    }
    this.setInputDate();
  },
  render: function render(h) {
    return this.genPicker('picker--date');
  }
};