import streamlit as st
import pickle
from PyPDF2 import PdfReader
from streamlit_extras.add_vertical_space import add_vertical_space
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import os
import time
import hashlib



st.set_page_config(page_title='🤗💬 PDF Chat App - GPT')




def main():
    st.header("Talk to your EduBot 💬")
    # Floating chatbot image
    st.markdown(
        """
        <style>
            .floating-chatbot {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999;
            }
        </style>
        <div class="floating-chatbot">
            <img src="E:\Chatbot\image1_chat.png" alt="EduBot" width="50">
        </div>
        """,
        unsafe_allow_html=True
    )

    v='demo'
    openai_key = "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"
    if openai_key==v:
        openai_key=st.secrets["OPENAI_API_KEY"]
    os.environ["OPENAI_API_KEY"] = openai_key

    # Placeholder for chat
    chat_placeholder = st.empty()

    pdf_path = "EditedWA0000.pdf"

    if os.path.exists(pdf_path):
        pdf_reader = PdfReader(pdf_path)

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        # Generate a unique identifier for the store name
        timestamp = str(int(time.time()))
        content_hash = hashlib.sha256(text.encode()).hexdigest()[:8]  # Use the first 8 characters of the hash
        pdf_filename = os.path.splitext(os.path.basename(pdf_path))[0]
        store_name = f"{pdf_filename}_{timestamp}_{content_hash}"

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text=text)

        if os.path.exists(f"{store_name}.pkl"):
            with open(f"{store_name}.pkl", "rb") as f:
                VectorStore = pickle.load(f)
        else:
            embeddings = OpenAIEmbeddings()
            VectorStore = FAISS.from_texts(chunks, embedding=embeddings)
            with open(f"{store_name}.pkl", "wb") as f:
                pickle.dump(VectorStore, f)


        
        # Accept user questions/query
        st.header("Ask questions about University:")
        q="Tell me about the content of the PDF"
        query = st.text_input("Questions",value=q)

        if st.button("Ask"):
            if openai_key=='':
                st.write('Warning: Please pass your OPEN AI API KEY')
            else:
                docs = VectorStore.similarity_search(query=query, k=3)

                llm = OpenAI(model="gpt-3.5-turbo-instruct")
                chain = load_qa_chain(llm=llm, chain_type="stuff")
                with get_openai_callback() as cb:
                    response = chain.run(input_documents=docs, question=query)
                    print(cb)
                st.header("Answer:")
                st.write(response)
                st.write('------')

if __name__ == '__main__':
    main()


