exports.listFilter = [
    {
        name: 'currency',
        func: function (num, slash) {
            num = parseInt(num);
            var split = slash || '.';
            return num.toFixed().replace(/./g, function (c, i, a) {
                return i > 0 && c !== split && (a.length - i) % 3 === 0 ? split + c : c;
            });
        }
    }
];