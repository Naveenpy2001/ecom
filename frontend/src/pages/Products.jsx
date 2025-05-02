import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [formData, SetFormData] = useState({
    name: "",
    description: "",
    price: "",
    category :'',
    images:null,
    units:''
  });
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [edit, setEdit] = useState(null);

  const [selectIds, setSelectIds] = useState([]);
  const [msg,setMsg] = useState('')

  const [nextPage,setNextPage] = useState(null)
  const [prevPage,setPrevPage] = useState(null)
  const [page,setPage] = useState(1)

   const [search,setSearch] = useState('')

   const [category,setCategory] = useState('')
   const [minPrice,setMinPrice] = useState('')
   const [maxPrice,setMaxPrice] = useState('')
   const [sortOrder, setSortOrder] = useState("");


  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetFormData({
      ...formData,
      [name]: value,
    });
  };

  const newFormData = new FormData();
  newFormData.append('name' ,formData.name);
  newFormData.append('description',formData.description);
  newFormData.append('price',formData.price)
  newFormData.append('category',formData.category);
  newFormData.append('units',formData.units);
  if(formData.images) {
    newFormData.append('images',formData.images)
  }


  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/products/",
        newFormData,{
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // console.log(res.data);
      // console.log(res.status);     //201
      // console.log(res.statusText);     //created
      if (res.status === 201) {
        SetFormData({
          name: "",
          description: "",
          price: "",
          category:'',
          images:'',
          units:''
        });
        fetchProducts();
      }
    } catch (error) {
      console.log('error in post',error);
      
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page,search,category,sortOrder]);

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/products/?search=${search}&page=${pageNum}&category=${category}&ordering=${sortOrder}`);
      setLoading(false);
      setProducts(res.data.results);

        // console.log(res.data.results);
      // console.log(res.status);     //200
      // console.log(res.statusText); // ok
      setNextPage(res.data.next)
      setPrevPage(res.data.previous)
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };



  const deleteProduct = async (id) => {
    const res = await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
    setProducts(products.filter((p) => p.id !== id));
    // console.log(res);
  };

  // update
  const updateProduct = async () => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/products/${edit}/`,
        newFormData
      );
      // console.log(res);
      SetFormData({
        name: "",
        description: "",
        price: "",
        category:'',
        images:null,
        units:''
      });

      setEdit(null);
      fetchProducts();
    } catch (error) {
      console.log("error", error);
    }
  };

  const togglePubslih = async (id) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/products/${id}/publish/`
      );
      // console.log(res);
      if (res.status === 200) {
        // Or whatever success status your API returns
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === id ? { ...p, is_published: res.data.is_published } : p
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSelection = (id) => {
    setSelectIds(
      selectIds.includes(id)
        ? selectIds.filter((i) => i !== id)
        : [...selectIds, id]
    );
    // console.log(selectIds);
  };


  const bulkDelete =async () => {
    try {
        const res = await axios.post(`http://127.0.0.1:8000/api/products/bulk_delete/`,{ids:selectIds});
        console.log(res.data.message);
        setProducts(products.filter((p) => !selectIds.includes(p.id)))
        setSelectIds([])
        setMsg(res.data.message)
        
    } catch (error) {
        console.log(error);
        
    }
  }
  

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission & page refresh
    setSearchQuery(search); // Update search query when button is clicked
    setPage(1); // Reset to first page on new search
  };

  console.log(products);
  

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Product List</h2>
        {/* <form onSubmit={handleSearch}> */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
           <label>Category: </label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="home">Home & Kitchen</option>
      </select>

      <label>Min Price: </label>
      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

      <label>Max Price: </label>
      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price">Price: Low to High</option>
        <option value="-price">Price: High to Low</option>
      </select>
        {/* <button type="submit">Search</button> */}
      {/* </form>  */}
      <br /> <br />
        <button onClick={bulkDelete} disabled={selectIds.length ===0}>Delete Multiple</button>
       {msg}
        <ul>
          {
            loading ? (<h1>loading</h1>) : (
              <>
              {products.map((eachProduct, index) => (
            <ul key={eachProduct.id} style={{ padding: "5px 0" }}>
              <input
                type="checkbox"
                checked={selectIds.includes(eachProduct.id)}
                onChange={() => toggleSelection(eachProduct.id)}
              />
              <li>

                {
                  eachProduct.images && (
                    <img src={eachProduct.images} alt={eachProduct.name}  width={100}/>
                  )
                }
              </li>
              <li style={{ padding: "5px 0" }}>
                {" "}
                {index + 1} <b>Name :</b> {eachProduct.name}{" "}
              </li>
              <li style={{ padding: "5px 0" }}>
                {" "}
                <b>Desc :</b> {eachProduct.description}{" "}
              </li>
              <li style={{ padding: "5px 0" }}>
                {" "}
                <b>Just :</b> {eachProduct.price}/-{" "}
              </li>
              <li style={{ padding: "5px 0" }}>
                {" "}
                <b># {eachProduct.category}</b>{" "}
              </li>
              <li style={{ padding: "5px 0" }}>
                {" "}
                <b>Stock {eachProduct.units} | Status : {eachProduct.is_available ? 'Available' : 'Out of Stock'} </b>{" "}
              </li>
              <span
                style={{
                  color: eachProduct.is_published ? "green" : "red",
                  padding: " 5px 10px",
                  margin: "8px 0",
                  border: "1px solid #000",
                  display: "inline-block",
                }}
              >
                {eachProduct.is_published ? "Published" : "Unpublished"}
              </span>{" "}
              <br />
              <button
                style={{ padding: "3px 10px" }}
                onClick={() => deleteProduct(eachProduct.id)}
              >
                Delete
              </button>{" "}
              <button
                style={{ padding: "3px 10px" }}
                onClick={() => {
                  setEdit(eachProduct.id);
                  SetFormData({
                    name: eachProduct.name,
                    description: eachProduct.description,
                    price: eachProduct.price,
                    category:eachProduct.category,
                    image:eachProduct.image,
                    units:eachProduct.units
                  });
                }}
              >
                edit
              </button>{" "}
              <button onClick={() => togglePubslih(eachProduct.id)}>
                {eachProduct.is_published ? "Unpublish" : "Publish"}
              </button>
              <hr />
            </ul>
          ))}
              </>
            )
          }
        </ul>
        <button disabled={!prevPage} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page: {page}</span>
      <button disabled={!nextPage} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <h1>{edit ? "Edit Product" : "Add Products"}</h1>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
      />
      <input type="number" placeholder="Units (Stock)" value={formData.units} name="units" onChange={handleInputChange} required />
      <input type="file" accept="image/" onChange={(e) => SetFormData({...formData, images: e.target.files[0]})}  />
      <select value={formData.category} name="category" onChange={handleInputChange} required>
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Kitchen</option>
        </select>
      {edit ? (
        <button onClick={updateProduct}>Update</button>
      ) : (
        <button onClick={addProduct}>Add</button>
      )}
      
    </>
  );
};

export default Products;
