import _ from './type';
import tool from './tool';
import Reg from './reg';
// 解析器

/**
 * api 文档解析器
 * @param {string} doc 
 * @returns array
 */
export const apiDocParser = (doc) => {
  // 如果不是字符串直接返回
  if(!_.isString(doc)) return {};
  // 以@分隔作为数组
  const arr = doc.split("@");

  const data = {};
  arr.map(str => {
    str = str.replace("\n", "");
    // 判断是否是api开头
    if(/^api/.test(str)){
      const p = tool.getSplitFilter(str, " ");
      data["api"] = {
        method: Reg.type(p[1]),
        url: p[2],
        title: p[3],
      }
      return
    }
    // 匹配版本号
    if(/^version/.test(str)){
      data["version"] = {
        title: "接口  版本号",
        content: tool.getSplitFilter(str, "version")[0],
      };
      return
    }
    // 匹配描述
    if(/^description/.test(str)){
      data["description"] = {
        title: "描述",
        content: tool.getSplitFilter(str, "description")[0]
      };
      return
    }
    // 匹配备注
    if(/^remark/.test(str)){
      data["remark"] = {
        title: "备注",
        content: tool.getSplitFilter(str, "remark")[0]
      };
      return
    }
    // 匹配错误信息
    if(/^errorExample/.test(str)){
      data["errorExample"] = {
        title: "错误返回示例",
        code: tool.getSplitFilter(str, "errorExample", false)[0]
      };
      return
    }

    // 匹配正确信息
    if(/^successExample/.test(str)){
      data["successExample"] = {
        title: "正确返回示例",
        code: tool.getSplitFilter(str, "successExample", false)[0]
      };
      return
    }
    
    // 匹配参数
    if(/^param/.test(str) || /^returnParam/.test(str)){
      const p = tool.getSplitFilter(str, " ");
      const param = {
        type: Reg.type(p[1]),
        explain: p[3],
        field: p[2],
        onNull: false
      }
      // 判断是否必填
      if(param.field.indexOf("*") != -1){
        param.onNull = true;
        param.field = param.field.replace("*", "")
      }

      // 匹配正常参数
      if(/^param/.test(str)){
        if(_.isEmpty(data.param)){
          data.param = {
            title: "请求参数",
            list: [param],
          }
        }else {
          data.param.list.push(param)
        }
      }
      // 匹配返回参数
      if(/^returnParam/.test(str)){
        if(_.isEmpty(data.returnParam)){
          data.returnParam = {
            title: "返回参数",
            list: [param],
          }
        }else {
          data.returnParam.list.push(param)
        }
      }
      return
    }
  });
  return data
}