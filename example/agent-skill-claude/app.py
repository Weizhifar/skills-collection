import streamlit as st
import pandas as pd
from datetime import datetime
import os

# --- 1. 页面基础配置 ---
st.set_page_config(
    page_title="简易妙搭 - 团队任务管理",
    page_icon="🚀",
    layout="wide"
)

# 模拟数据库（使用本地 CSV 文件）
DB_FILE = 'data.csv'

# 初始化数据函数
def load_data():
    if not os.path.exists(DB_FILE):
        return pd.DataFrame(columns=["提交时间", "任务名称", "负责人", "优先级", "状态"])
    return pd.read_csv(DB_FILE)

def save_data(new_entry):
    df = load_data()
    # 将新数据转换为 DataFrame 并合并 (兼容性写法)
    new_df = pd.DataFrame([new_entry])
    df = pd.concat([new_df, df], ignore_index=True)
    df.to_csv(DB_FILE, index=False)
    return df

# --- 2. 侧边栏：应用导航与表单 ---
with st.sidebar:
    st.title("🚀 任务提报端")
    st.write("类似妙搭的表单录入功能")
    
    with st.form("task_form", clear_on_submit=True):
        name = st.text_input("任务名称")
        owner = st.selectbox("负责人", ["张三", "李四", "王五", "Robot"])
        priority = st.select_slider("优先级", options=["P3", "P2", "P1", "Critical"])
        status = st.radio("初始状态", ["待处理", "进行中"])
        
        submitted = st.form_submit_button("🚀 立即创建")
        
        if submitted and name:
            new_data = {
                "提交时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "任务名称": name,
                "负责人": owner,
                "优先级": priority,
                "状态": status
            }
            save_data(new_data)
            st.success("✅ 任务已创建！")
        elif submitted and not name:
            st.error("❌ 请输入任务名称")

# --- 3. 主界面：数据仪表盘 ---
st.title("📊 团队协作看板")
st.markdown("这里模拟妙搭的 **多维表格** 视图，实时展示录入的数据。")

# 加载数据
df = load_data()

# 顶部指标卡 (Metrics)
col1, col2, col3 = st.columns(3)
col1.metric("总任务数", len(df))
col2.metric("高优任务 (P1/Critical)", len(df[df['优先级'].isin(['P1', 'Critical'])]))
col3.metric("待处理", len(df[df['状态'] == '待处理']))

st.divider()

# 数据筛选与展示
if not df.empty:
    # 简单的筛选器
    filter_owner = st.multiselect("筛选负责人", options=df["负责人"].unique(), default=df["负责人"].unique())
    filtered_df = df[df["负责人"].isin(filter_owner)]

    # 展示表格
    st.dataframe(
        filtered_df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "优先级": st.column_config.TextColumn(
                "优先级",
                help="任务紧急程度",
                validate="^(P1|P2|P3|Critical)$"
            ),
            "状态": st.column_config.SelectboxColumn(
                "状态",
                options=["待处理", "进行中", "已完成"],
                required=True
            )
        }
    )
else:
    st.info("👈 暂无数据，请在左侧侧边栏添加第一条任务")