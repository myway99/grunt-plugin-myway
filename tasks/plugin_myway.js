/*
 * grunt-plugin-myway
 * 
 *
 * Copyright (c) 2020 myway99
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('plugin_myway', 'myway grunt plugin', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      who: 'sky',
      commentSymbol: '//'
    });

    var testExistRegexMap = {
      'sky': /test1/,
      'sea': /test99/
    }

    //
    var who = options.who,
        commentSymbol = options.commentSymbol,
        commentFilepathMap = {
          'sky': 'assets/myway.txt',
          'sea': 'assets/myway99.txt'
        },
        // __dirname是nodejs环境下的全局变量，表示当前运行代码所在目录
        // 拼接路径
        commentFilepath = path.join(__dirname, commentFilepathMap[who]),
        // 读取文件内容
        commentContent = grunt.file.read(commentFilepath),
        // 对换行符进行转义
        lineCommentArr = commentContent.split(grunt.util.normalizelf('\n'));

    // 遍历操作每行内容
    lineCommentArr.forEach(function (value, index, arr){
      // 在每行前加上注释符
      arr[index] = commentSymbol + value;
    });

    // 格式化换行符
    commentContent = lineCommentArr.join(grunt.util.normalizelf('\n'));


    // 读写操作：
    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // Concat specified files.
      file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        // 拿到原始文件内容
        var originalFileContent = grunt.file.read(filepath),
            // 拼接生成新的内容
            newFileContent = commentContent + grunt.util.normalizelf('\n') + originalFileContent;

        // 校验是否已经添加：
        if(testExistRegexMap[who].test(originalFileContent)){
          return;
        }

        // 将新内容写入
        grunt.file.write(filepath, newFileContent);
        // return grunt.file.read(filepath);
      });

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
